const Trip = require('../models/Trip');

async function getAll(){
    return Trip.find({}).lean();
};

async function create(trip){
   let id = '';
   await Trip.create(trip).then(trip => id = trip._id);

   return id;
}

async function getById(id){
    return await Trip.findById(id).lean();
}


async function join(tripId,user){
    const trip = await Trip.findById(tripId);
    trip.buddies.push(user);
    trip.seats -= 1;
    await trip.save();
  }

async function deleteById(id){
    return await Trip.findByIdAndRemove(id);
} 

async function update(id,trip){
    const existing = await Trip.findById(id);

    existing.start = trip.start,
    existing.end = trip.end,
    existing.date = trip.date,
    existing.time = trip.time,
    existing.imageUrl = trip.imageUrl,
    existing.car = trip.car,
    existing.seats = Number(trip.seats),
    existing.price = Number(trip.price),
    existing.description = trip.description

    await existing.save();
}

module.exports = {
    getAll,
    create,
    getById,
    join,
    deleteById,
    update
} 