import items from "./items.json"


// api endpoint to fetch items from db
export default function handler(req, res) {
    // if get request
    if (req.method === "GET") {
        // create copy of items w/o hashes, filename
        const itemsNoHashes = items.map((item) => {
            const{ hash, filename, ...rest } = item;
            return rest;
        });

        res.status(200).json(itemsNoHashes);
    }
    else{
        res.status(405).send("methodNotAllowed");
    }
}

