//import express and create our app
import express from "express";
const app = express();

//Middleware 
//log every request 
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

//Database 
const listings = [
 { id: 1, title: "Nile View Apartment", pricePerNight: 85 },
 { id: 2, title: "Beach House", pricePerNight: 140 },
 { id: 3, title: "Desert Eco-Lodge", pricePerNight: 60 },
];


//Model 
//Only code that touches listings array
function getListing() { 
    return listings;
}

function getlistingById(id) {
    return listings.find((listing) => listing.id === id);
}

function addListing(data) {
    const listing = {
        id: nextId++,
        title: data.title,
        pricePerNight: data.pricePerNight,
    };
    listings.push(listing);
    return listing;
}

function updateListing(id, data) {
    const listing = getlistingById(id);
    if (listing) {
        listing.title = data.title;
        listing.pricePerNight = data.pricePerNight;
    }
    return listing;
}
function removeListing(id) {
    const listing = getlistingById(id);
    listings = listings.filter((item) => item.id !== id);
    return listing;
}

//Controller
function handleGetAll(req, res) {
    res.json(getListing());
}

function handleGetOne(req, res) {
    const listing = getlistingById(Number(req.params.id));
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
}

function handleCreate(req, res) {
    const data = req.body || {};  //no body sent? use an empty object
    if (!data.title || !data.pricePerNight) {
        return res.status(400).json({ error: "Missing title or pricePerNight" });
    }
    else {
        res.status(201).json(addListing(data));
    }
}

function handleUpdate(req, res) {
    const data = req.body || {};
    if (!data.title || !data.pricePerNight) {
        return res.status(400).json({ error: "title and pricePerNight are required" });

    }
    const listing = updateListing(Number(req.params.id), data);
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
}

function handleDelete(req, res) {
    const listing = removeListing(Number(req.params.id));
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }
    res.status(204).end();
}


//Routes 
app.get("/listings", handleGetAll);
app.get("/listings/:id", handleGetOne);
app.post("/listings", handleCreate);
app.put("/listings/:id", handleUpdate);
app.delete("/listings/:id", handleDelete);




//Start the server
app.listen(3000, () => {
 console.log("Server running on http://localhost:3000");
});