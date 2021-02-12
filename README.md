# Indexer proxy

This application is used as a proxy for [searchyll][searchyll]
for indexing the documents in [Swedbank Pay developer portal][spayDevPortal].

## Details

The software is run using `npm run start` or `node server.js`.

Api key is stored in the environmental key `apiKey` and must be sent
in the `Authorization` header of a `HTTP` request.

The URL for the elastic instance is stored in the environmental key
`elasticHost`.

The app runs on port number stored in the environmental key `PORT`.

There is currently a hard limit on the size of the request set to
100mb.
This was set because errors occured when the size was larger.

[searchyll]: https://github.com/omc/searchyll
[spayDevPortal]: https://github.com/SwedbankPay/developer.swedbankpay.com