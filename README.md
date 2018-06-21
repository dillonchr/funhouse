![](images/funhouse-logo.gif)
# Funhouse
## The dillonchristensen.com API for all things fun.

The goal here is to unify all apps I have running across platforms to have one central API that does my bidding. I've had [Kowalski](https://github.com/dillonchr/kowalski) running for a while now and I love the things he does, but I've been getting more interested in Open Source lately which has me expanding my horizons. So I thought it'd be wise to create a central API that does the heavy lifting and then have my slackbots/websites just share a resource for getting that sweet data.

Kowalski's not OS yet, but maybe soon? I hard-coded a lot of secrets into him so I'll have to sanitize him before I switch the Private/Public flag.

## Install
Funhouse isn't really for people to install. I mean it is because it's here and wholly available. But I don't know why anyone would really want it besides me.

## Set up your `.env`
Funhouse uses `dotenv` for those tasty `.env` files that you can pass around. Here's a sample:

```bash
EBAY_API_KEY=
DB_URI=
DB_NAME=
BANKRUPT_PAYCHECK_COLLECTION=
BANKRUPT_BUDGET_COLLECTION=
BANKRUPT_BUDGET_CUT=
BANKRUPT_BUDGET_USERCOUNT=
DAILYTEXT_API_URL_PREFIX=
FIRED_URL=
FIRED_COLLECTION=
FIRED_SELECTOR_EMPLOYEES=
FIRED_SELECTOR_NAME=
FIRED_SELECTOR_POSITION=
FIRED_SELECTOR_PROFILEPIC=
FIRED_SELECTOR_BIO=
WFH_CONN_PORT=
WFH_CONN_URL=
WFH_CONN_USER=
WFH_CONN_PASS=
SENTRY_URL=
```

Once you get those set up, you'll be ready to serve up some sweet content.

## Stream-of-consciousness endpoint overview
It's late, I'm tired. I set out to migrate all of Funhouse's functionality to single modules. Inspired by @sindresorhus take on itty-bitty modules and fun with OS development. There are 9 main pieces of functionality and they live on 9 different URLs. Bookmancy is a book price searcher that can search on AbeBooks.com and Ebay.com. It's located at `/books`. Budget is for the `bankrupt` module to manage your budget. You'll have to add your own user records to your mongo db with `{id: <id you'll know how to get>, transaction: []}`. Then you can ask `/budget/<id>` for balance and post transactions to it. Cryptonics is a quick and dirty way to make text appear cryptic. If you spell it with a K it's also a skateboard. Dailytext looks up the daily text and gives you back JSON at `/dailytext`. Fired scrapes your company's website for employees and figures out when one goes missing. It's at `/fired`. GDQ looks up the current GDQ schedule, lives at `/gdq`. Inflation goes as far back as 1913 and tells you how much a certain dollar amount then would be worth now, `/inflation`. Paycheck is for paycheck transactions and balance queries, `/paycheck`. And finally! WFH checks if the coast is clear to phone it in today, lives at `/wfh`.

## Goals
I would like to polish up the documentation and get some tests written. I've been putting off unit-testing for pretty much forever. I figured making modules of all the features would be a great breakpoint to add tests. But alas, I wanted to see this thing work more than I wanted to feel like it wasn't going to fall apart during development. 

I would also like to grow the feature set and improve the overall design of the server itself. We'll see where that ends up though, because I was pretty surprised with some of the crazy code I had left in from the last time I thought it was good enough to ship.
