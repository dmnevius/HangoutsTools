# Hangouts Tools

Tools for hangouts statistics.

## User guide

Table of contents:
- [Google Takeout](#google-takeout)
- [Creating A Project](#creating-project)

<a name="google-takeout"></a>
#### Google Takeout
To quickly download a JSON file with all of your hangouts, visit https://myaccount.google.com/privacy?pli=1#takeout

De-select everything but Hangouts and follow Google's instructions. Once an email arrives with the download link, download and extract your takeout somewhere easy to find.

<a name="creating-project"></a>
#### Creating a Project
Projects in Hangouts Tools are

To create a project, launch Hangouts Tools and click "Go" under "New Project". The new page will show several options which are explained below.
- __Name__ - Projects can be given names simply to make managing them easier. Giving your project a name is completely optional.
- __Takeout File__ - The location of your _extracted_ Google takeout file, "Hangouts.json". You can may the _full_ location by hand or locate it by clicking "Browse".
- __Analysis Depth__ - The analysis depth of a project determines the size of the output file and the details it will show. How many hangouts you have and what you plan to do with the analysis should be taken in to account when choosing a depth.
  - ___Basic___ - The basic depth will create the smallest size file and will contain general information, as well as detailed information about individual hangouts. This information will include the members, their post counts, and a time-line of posts.
  - ___Advanced___ - The advanced depth will contain everything from the basic depth, as well as more interesting data such as the amount of spam, who most often replies to each other, and more.
  - ___Extreme___ - Extreme is the same as advanced, except that it includes information about word usage. You will be able to search for words to see how many times they have been said in total and by every member of your hangouts. You will also have a timeline of that word's usage. This file size is considerably bigger than the others.

## Launching from Source
If you cannot wait for the official release, you can grab the latest version immediately if you are willing to install the required software.

To begin, you will need to download the following programs, if you do not already have them:
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/)

When Node.js is installed, run the following command in a terminal:
```
npm install -g electron-prebuilt gulp
```

Then, open a new terminal in the location you want to download Hangouts Tools and run the following commands in order:
```
git clone https://github.com/dmnevius/HangoutsTools
cd HangoutsTools
npm install
bower install
git init
```

Take note of where the HangoutsTools folder was created, as you will need to open a terminal in this location every time you want to launch the program.

To launch Hangouts Tools, simply run:
```
npm start
```

Whenever the number [here](http://phony.link/ht-ver) changes, you can update your copy of Hangouts Tools. To do so, simply run:
```
npm run pull
```
