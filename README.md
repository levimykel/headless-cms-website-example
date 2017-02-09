## Sample Website with prismic.io Headless CMS

This is a sample website project using [NodeJS](http://nodejs.org/) with content managed with [prismic.io](http://prismic.io) Headless CMS. 

### Setting up the project

This project uses NodeJS, so you will need to make sure you have [NodeJS installed on your local machine](https://nodejs.org/en/download/).

#### Install the project with the prismic.io CLI

The quickest and easiest way to get this project up and running is to use the prismic.io command line interface. To install it, Simply run the following command:

```
npm install -g prismic-cli
```

Once installed, you can use the CLI to launch this project. From the directory where you want to install the project files, run the following command:

```
prismic theme https://github.com/levimykel/website-example-with-prismic
```

This will not only install the project files, but will also set up a new repository on prismic.io and create all the custom types needed for this example website.

#### Create some content

Go to your newly created prismic.io content repository and create some content. 

Start by creating a homepage. Go to Content, click on "New", and select the Homepage custom type. Fill it in with text and images, then save and publish.

Next create a few pages. Again don't forget to save and publish. 

Finally create a navigation. 

Once you have your content created, you'll be ready to launch the website. 

#### Launch the project

Launching the project is easy! From your project folder, run the following commands:

```
npm install -g nodemon
nodemon
```

This will launch the project on your local machine. Point your browser to the local server and you should see your website running. The project retrieves the content from your prismic.io repository and displays it in your browser.


#### Learn more about prismic.io

You can find out more about prismic.io and how to get started using the [prismic.io quickstart project](https://prismic.io/quickstart) or by exploring the [documentation](https://prismic.io/docs#?lang=node).
