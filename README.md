# Set your credentials
Set `karlsbadUsername` and `karlsbadPassword` as environment variables.

# Start
`yarn install && yarn start`

# APIs
### Topics
BaseUrl: `/api/topics`

#### `/` GET
List of all posts for all topics.

#### `/:name` GET
* `name` - Name of a single Topic
List of all post of a single topic.


#### POST `/`
Creates a new Post of a topic.


## Future
### Authorization

#### POST `/:name`
__Body__
    * onlineFrom?: UTCDate
    * onlineUntil?: UTCDate
    * printKW?: number
    * header: string


* `username`: username to authenticate
* `password`: password to authenticate