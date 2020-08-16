## RIPPLE FEE ESTIMATOR SERVICE

### STEPS
* Connect to ripple node (done)
* Handle reconnecting to ripple node (done)
* Listen for blocks (done)
* Get fee from all transactions in block and save highest transaction fee (done)
* Keep average of fee for the latest 30 blocks (done)
* Create api endpoint to get average, allow query parameter of number of blocks to average / default to 30 blocks

### OPTIONAL FEATURE
* Create api endpoint for the highest fees ie save the highest fee in a block.
