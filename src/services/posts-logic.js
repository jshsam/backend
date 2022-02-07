
// Posts .get request
const getPosts = (req, res) => {
    
    const axios = require('axios');
    const tags = req.query.tag;
    const sortBy = req.query.sortBy || 'id';
    const direction = req.query.direction;
    
    // First checks if tags parameter is used. If not sends error message.
    if(!tags) {
        res.status(400).send({ error: "Tags parameter is required" });
        return;
    };

    // Checks if sortBy and direction parameters are valid. If not sends appropriate error message.
    if (!validateParameters(sortBy, direction, res)) {return;};
       
    // With Parameters all present/valid request moves forward.
    let tagsArray = tags.split(',');

    // Sets up the request calls with all tag parameters
    let requests = tagsArray.map((tag, i) => {
        return axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${tag}`);
    });

    // Makes concurrent calls to the api using requests.
    axios.all(requests).then(function(results) {
        let temp = results.map(r => r.data);

        // Converting the 'temp' array to Set to remove duplicates and then to Object to easier access the attributes nested inside.
        let resultArray = Object.assign(...new Set(temp));
        

        /* Passing sortBy, direction, and resultarray to sortResults function to and to sort data in resultArray 
        based on direction. Checking if 'desc' first since default is 'asc'*/
        resultArray = sortResults(sortBy, direction, resultArray);                
        
        // Sending the sorted results
        res.status(200).send(resultArray);
    });
};

// validateParameters function
function validateParameters(sortBy, direction, res) {
    const vaildSortBy = ['id', 'reads', 'likes', 'popularity'];
    const validDirection = ['desc', 'asc'];
    let isValid = true;

    if (sortBy && !vaildSortBy.includes(sortBy)) {
        res.status(400).send({
            error: 'sortBy parameter is invalid' 
        });
        return !isValid;

    } else if (direction && !validDirection.includes(direction)) {
        res.status(400).send({
            error: 'direction parameter is invalid'
        });
        return !isValid;
    }
    return isValid;
};

// sortResults function
function sortResults(sortBy, direction, resultArray) {
    
    if (direction === 'desc') {
        resultArray.posts.sort((a, b) => b[sortBy] - a[sortBy])
    } else { 
        resultArray.posts.sort((a, b) => a[sortBy] - b[sortBy])
    }

    return resultArray;
};

module.exports = getPosts;