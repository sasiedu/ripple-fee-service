## RIPPLE FEE ESTIMATOR SERVICE

### STEPS
* Connect to ripple node
* Handle reconnecting to ripple node
* Listen for blocks
* Get fee from all transactions in block and save highest transaction fee
* Keep average of fee for the latest 30 blocks
* Create api endpoint to get average, allow query parameter of number of blocks to average / default to 30 blocks

### OPTIONAL FEATURE
* Create api endpoint for the highest fees ie save the highest fee in a block.
