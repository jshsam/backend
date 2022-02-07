
// Posts .get request
const getPosts = (req, res) => {
    
    const axios = require('axios');
    const tags = req.query.tag;
    const sortBy = req.query.sortBy;
    const direction = req.query.direction;
    const vaildSortBy = ['id', 'reads', 'likes', 'popularity'];
    const defaultSort = 'id';
    const validDirection = ['desc', 'asc'];
    
    // First checks if tags parameter is used. If not sends error message.
    if(tags) {

        // Checks if sortBy parameter is valid. If not sends error message.
       if (sortBy && vaildSortBy.indexOf(sortBy) === -1) {
           res.status(400).send({
               error: 'sortBy parameter is invalid'
           });

           // Checks if direction parameter is valid. If not sends error message.
       } else if (direction && validDirection.indexOf(direction) === -1) {
            res.status(400).send({
                error: 'direction parameter is invalid'
            });

            // With Parameters all present/valid request moves forward.
       } else {
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
                

                /* Passing sortBy, direction, and resultarray to sortByFn function to assign sortBy to sortOption or using defaultSort if sortBy had no value.
                   and to sort data in resultArray based on direction. Checking if 'desc' first since default is 'asc'*/
                resultArray = sortByFn(sortBy, direction, resultArray);                
                
                // Sending the sorted results
                res.status(200).send(resultArray);
            });
       }
    } else {
        res.status(400).send({ error: "Tags parameter is required" });
    };

    // sortByFn function
    function sortByFn(sortBy, direction, resultArray) {
        let sortOption;

        if(sortBy) {
            sortOption = sortBy;
        } else {
            sortOption = defaultSort;
        }

        if (direction === 'desc') {
            resultArray.posts.sort((a, b) => b[sortOption] - a[sortOption])
        } else { 
            resultArray.posts.sort((a, b) => a[sortOption] - b[sortOption])
        }

        return resultArray;
    };
};

module.exports = getPosts;