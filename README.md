# CMPE-273-Splitwise-V2
<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V1/blob/main/Frontend/src/Components/assets/splitwise_logo.png">
</p>

To gain a better understanding of the inner workings, tools and technologies used to develop a distributed full-stack application/product. 

## What it does
We have simulated various features present in the original web application like
* A new user would be able to sign up and will be redirected to his dashboard which shows a summary of his transactions (How much he owes, how much he is owed etc.)
* Existing users can log in and would be redirected to their respective dashboards.
*	Form based validations have been implemented to check proper inputs
*	The user can see a list of groups he is part of, he can also search within that list of groups if he wishes.
*	The left navbar also contains links to the recent activity page where the user can view a history of who has added bills into the group.
*	The same navbar also contains a link to the invite list page which displays a list of groups the user has been invited to. The user can accept the invitation, only  after accepting the invitation will the group be visible in the users group list.
*	The members list also changes based on the invite status.
*	A member can create a group by selecting all the users registered in the app.
*	A member can settle up the amount he is owed and the amount he owes.
*	A basic profile page is visible that gets the data from the database and displays the data stored in the backend. The user also has the ability to add profile picture and edit profile information.
*	The user can add and delete comments on each bill. The can only delete his/her own comments.
*	User can only leave group after all expenses have been settled up.



## How it was built
*	ReactJS makes get, post, put calls to express backend using routes.
*	NodeJS receives the requests and performs MongoDB operations to update the database.
*	Session is assigned to a user when he signs up or logs in.PassportJS and JWT used for authentication and authorization.
*	MongoDB database receives the requests from NodeJS and performs the operations to its tables.
*	Backend Sends the response back to React JS to display.
*	Having Kafka enables asynchronous communication and helps in scaling.
*	Used React Testing Library to write frontend tests and Mocha to write backend tests to see if system functions as expected.
*	Deployed the application on AWS EC2 instances to leverage easy scalability the cloud platform has to offer.
 
## Features
<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V2/blob/main/Frontend/src/Components/assets/img21.jpg">
</p>
<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V2/blob/main/Frontend/src/Components/assets/img32.jpg">
</p>
<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V2/blob/main/Frontend/src/Components/assets/img33.jpg">
</p>
<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V2/blob/main/Frontend/src/Components/assets/img34.jpg">
</p>
<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V2/blob/main/Frontend/src/Components/assets/img44.jpg">
</p>
<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V2/blob/main/Frontend/src/Components/assets/img45.jpg">
</p>
<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V2/blob/main/Frontend/src/Components/assets/img46.jpg">
</p>
<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V2/blob/main/Frontend/src/Components/assets/img54.jpg">
</p>
<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V2/blob/main/Frontend/src/Components/assets/img88.jpg">
</p>
<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V2/blob/main/Frontend/src/Components/assets/img56.jpg">
</p>
<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V2/blob/main/Frontend/src/Components/assets/img69.jpg">
</p>
<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V2/blob/main/Frontend/src/Components/assets/img69.jpg">
</p>
<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V2/blob/main/Frontend/src/Components/assets/img80.jpg">
</p>

<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V2/blob/main/Frontend/src/Components/assets/img89.jpg">
</p>
<p align="center">  
  <img  align="center" src="https://github.com/Yusuf-Juzar-Soni/CMPE-273-Splitwise-V2/blob/main/Frontend/src/Components/assets/img96.jpg">
</p>



## Tools used 
 ReactJS, NodeJS, ExpressJS,MongoDB, HTML5, React Bootstrap, Apache Kafka, PassportJS etc.

## Prerequisites
Before running this locally you must have Node, Express,MongoDB, Apache Kafka (check version is 2.11.--) etc.setup. 
Clone the repository to your machine.
* Go into the Backend folder and run command npm install
* After installation completes run command node server.js
* Connection message and listening on port message will be displayed on successful start
* Go into the  Kafka_Splitwise folder and run command npm install
* Start kafka and zookepeeper
* Create topics (check server file in Kafka_Splitwise for topic names.
* After installation completes run command node server.js in the kafka Splitwise folder.
* Connection message and listening on port message will be displayed on successful start

* Go to the Frontend folder and run command npm install
* After installation completes run command npm start
* Go to url http://localhost:3000 to view App

## Challenges I  ran into
* Kafka difficult to configure.

### For further information kindly read report present in the project folder.






