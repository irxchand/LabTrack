// REQ-LT-0074. Run in mongosh against the projection store, not SQL truth.
db = db.getSiblingDB('labtrack');
db.notifications.createIndex({user_id:1,event_id:-1});
db.demand.aggregate([
  {$group:{_id:{$ifNull:['$item_id','$component_name']},requested:{$sum:'$quantity'},occurrences:{$sum:1}}},
  {$sort:{requested:-1,_id:1}}
]);
db.deliveries.aggregate([
  {$group:{_id:{channel:'$channel',state:'$state'},count:{$sum:1}}},
  {$sort:{count:-1}}
]);
