# apiQuery

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c783cfa3326e42419fff0fbe62497e6f)](https://www.codacy.com/app/jpanuncillo/apiQuery?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=cookie-mafia/apiQuery&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/c783cfa3326e42419fff0fbe62497e6f)](https://www.codacy.com/app/jpanuncillo/apiQuery?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=cookie-mafia/apiQuery&amp;utm_campaign=Badge_Coverage)

<a href="http://www.antiifcampaign.com">
  <img height="60" width="120"
  src="http://antiifcampaign.com/assets/banner_my-team-has-joined.gif"
  alt="My team has joined Anti-IF Campaign"></a>

Utility functions to pipe api query string into datasource commands.  

## install via [npm](npmjs.org)

```shell
npm install api-query --save
npm install sequelize-provider --save
```

## Usage

#### Bind utility functions
```shell
# bind utility to local variable
let apiQuery = require( 'api-query' );

# utility requires a provider to perform actual datasource manipulations using a specific tech stack, only sequelize-provider is available as of now
let actionProvider = require( 'sequelize-provider' );
```
#### Declare allowed utility actions and set configurations
```shell
# list operation in an array
const operators = [ apiQuery.optr.FILTER, apiQuery.optr.BATCH, apiQuery.optr.SORT, apiQuery.optr.FIELD ];

# package provider + allowed operators
const config = { actionProvider, operators };
```
* **apiQuery.optr.FILTER :** allows query strings to control which data are returned by the api.
* **apiQuery.optr.BATCH :** allows query strings to group results into pages.
* **apiQuery.optr.SORT :** allows query strings to order results.
* **apiQuery.optr.FIELD :** allows query strings to get distince values for field(s) specified.

#### Using sequelize-provider's data packager
```shell
let packData = actionProvider.pack( main_sequalize_model, [<relarted_sequelize_models>] );
```
* **main_sequalize_model :** sequelize model whose **find** methods will be used by the utils to fetch data
* **[\<relarted_sequelize_models>\] :** array of models directly related to the main model

#### Using the utility
```shell
let results = apiQuery.start( packData, apiQueryParameters, config );
```
* **packData :** formatted data, readable by the provider used
* **apiQueryParameters :** object representaion of query parameter
* **config :** object used to control the utility

#### Using query parameters

##### Filtering
```shell
# Single filter
http://api/route?fltr_field1=value1

# multiple filter
http://api/route?fltr_field1=value1&fltr_field2=value2
```

##### Paging
```shell
http://api/route?limit=3&offset=2
```


##### Sorting
```shell
# single field ascending
http://api/route?sort=+field1

# single field descending
http://api/route?sort=-field1

# multiple field descending
http://api/route?sort=+field1,-field2 
```

##### Filtering + Distinct
```shell
# single field distinct
http://api/route?field=field1

# multipl field distinct
http://api/route?field=field1,field2
```
