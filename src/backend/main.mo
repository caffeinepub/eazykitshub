import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Jersey Store Types
  public type OrderStatus = {
    #pending;
    #confirmed;
    #shipped;
    #delivered;
  };

  public type Jersey = {
    id : Text;
    name : Text;
    team : Text;
    description : Text;
    priceCents : Nat;
    sizes : [Text];
    imageId : ?Storage.ExternalBlob;
    inStock : Bool;
    featured : Bool;
    createdAt : Time.Time;
  };

  public type OrderItem = {
    jerseyId : Text;
    jerseyName : Text;
    size : Text;
    quantity : Nat;
    unitPrice : Nat;
  };

  public type Order = {
    id : Text;
    items : [OrderItem];
    customerName : Text;
    customerEmail : Text;
    shippingAddress : Text;
    totalAmount : Nat;
    status : OrderStatus;
    createdAt : Time.Time;
  };

  public type NewOrder = {
    items : [OrderItem];
    customerName : Text;
    customerEmail : Text;
    shippingAddress : Text;
  };

  // Jersey Store State
  let jerseys = Map.empty<Text, Jersey>();
  let orders = Map.empty<Text, Order>();
  let featuredJerseys = Set.empty<Text>();

  func jerseyCompareByTimestamp(j1 : Jersey, j2 : Jersey) : Order.Order {
    Nat.compare(
      Int.abs(j1.createdAt),
      Int.abs(j2.createdAt),
    );
  };

  func orderCompareByTimestamp(o1 : Order, o2 : Order) : Order.Order {
    Nat.compare(
      Int.abs(o1.createdAt),
      Int.abs(o2.createdAt),
    );
  };

  // Mixins for shared functionality
  include MixinStorage();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Jerseys
  public query ({ caller }) func getAllJerseys() : async [Jersey] {
    jerseys.values().toArray().sort(jerseyCompareByTimestamp);
  };

  public query ({ caller }) func getJersey(id : Text) : async Jersey {
    switch (jerseys.get(id)) {
      case (null) { Runtime.trap("Jersey not found") };
      case (?jersey) { jersey };
    };
  };

  public query ({ caller }) func getFeaturedJerseys() : async [Jersey] {
    JerseyStoreHelper.getJerseys(jerseys, featuredJerseys.values().toArray());
  };

  public shared ({ caller }) func addJersey(jersey : Jersey) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add jerseys");
    };
    jerseys.add(jersey.id, jersey);
    if (jersey.featured) {
      featuredJerseys.add(jersey.id);
    };
  };

  public shared ({ caller }) func updateJersey(jersey : Jersey) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update jerseys");
    };
    if (not jerseys.containsKey(jersey.id)) {
      Runtime.trap("Jersey not found");
    };
    jerseys.add(jersey.id, jersey);
    if (jersey.featured) {
      featuredJerseys.add(jersey.id);
    } else {
      featuredJerseys.remove(jersey.id);
    };
  };

  public shared ({ caller }) func deleteJersey(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete jerseys");
    };
    if (not jerseys.containsKey(id)) {
      Runtime.trap("Jersey not found");
    };
    jerseys.remove(id);
    featuredJerseys.remove(id);
  };

  public shared ({ caller }) func toggleInStock(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can toggle stock status");
    };
    switch (jerseys.get(id)) {
      case (null) { Runtime.trap("Jersey not found") };
      case (?jersey) {
        jerseys.add(id, { jersey with inStock = not jersey.inStock });
      };
    };
  };

  public shared ({ caller }) func toggleFeatured(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can toggle featured status");
    };
    switch (jerseys.get(id)) {
      case (null) { Runtime.trap("Jersey not found") };
      case (?jersey) {
        jerseys.add(id, { jersey with featured = not jersey.featured });
        if (not jersey.featured) {
          featuredJerseys.add(id);
        } else {
          featuredJerseys.remove(id);
        };
      };
    };
  };

  // Orders
  public shared ({ caller }) func submitOrder(newOrder : NewOrder) : async Text {
    let id = Time.now().toText();
    let totalAmount = JerseyStoreHelper.calculateTotal(newOrder.items);
    let order : Order = {
      id;
      items = newOrder.items;
      customerName = newOrder.customerName;
      customerEmail = newOrder.customerEmail;
      shippingAddress = newOrder.shippingAddress;
      totalAmount;
      status = #pending;
      createdAt = Time.now();
    };
    orders.add(id, order);
    id;
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().sort(orderCompareByTimestamp);
  };

  public query ({ caller }) func getOrder(id : Text) : async Order {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
  };

  public shared ({ caller }) func updateOrderStatus(id : Text, status : OrderStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        orders.add(id, { order with status });
      };
    };
  };

  // Sample Data Initialization
  public shared ({ caller }) func initializeSampleData() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can initialize sample data");
    };
    if (jerseys.size() > 0) { return () };
    let sampleJerseys = [
      JerseyStoreHelper.createSampleJersey(
        "BRAZIL001",
        "Brazil Home",
        "Brazil",
        "Official Brazil home jersey",
        8500,
        ["S", "M", "L", "XL"]
      ),
      JerseyStoreHelper.createSampleJersey(
        "ARGENTINA002",
        "Argentina Away",
        "Argentina",
        "Official Argentina away jersey",
        8700,
        ["S", "M", "L", "XL"]
      ),
      JerseyStoreHelper.createSampleJersey(
        "FRANCE003",
        "France Home",
        "France",
        "Official France home jersey",
        9000,
        ["S", "M", "L", "XL"]
      ),
      JerseyStoreHelper.createSampleJersey(
        "GERMANY004",
        "Germany Away",
        "Germany",
        "Official Germany away jersey",
        8800,
        ["S", "M", "L", "XL"]
      ),
      JerseyStoreHelper.createSampleJersey(
        "SPAIN005",
        "Spain Home",
        "Spain",
        "Official Spain home jersey",
        8600,
        ["S", "M", "L", "XL"]
      ),
      JerseyStoreHelper.createSampleJersey(
        "ENGLAND006",
        "England Away",
        "England",
        "Official England away jersey",
        8900,
        ["S", "M", "L", "XL"]
      ),
    ];
    for (jersey in sampleJerseys.values()) {
      jerseys.add(jersey.id, jersey);
    };
  };

  // Jerseys Helper
  module JerseyStoreHelper {
    public func calculateTotal(items : [OrderItem]) : Nat {
      items.values().foldLeft(
        0,
        func(acc, item) { acc + (item.unitPrice * item.quantity) },
      );
    };

    public func getJerseys(jerseys : Map.Map<Text, Jersey>, ids : [Text]) : [Jersey] {
      let jerseysIter = ids.values().map(
        func(id) {
          switch (jerseys.get(id)) {
            case (?j) { ?j };
            case (null) { null };
          };
        }
      );
      jerseysIter.toArray().filterMap(func(j) { j });
    };

    public func createSampleJersey(id : Text, name : Text, team : Text, description : Text, priceCents : Nat, sizes : [Text]) : Jersey {
      {
        id;
        name;
        team;
        description;
        priceCents;
        sizes;
        imageId = null;
        inStock = true;
        featured = false;
        createdAt = Time.now();
      };
    };
  };
};
