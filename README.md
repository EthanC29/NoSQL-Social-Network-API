# NoSQL Social Network API

## Description

An NoSQL-based API for a social media platform that uses Mongoose and MongoDB. Includes functionalioty for creating and deleting users, matching and removing users to other users as friends, creating and deleting thoughts and linking them to the user that wrote them, and creating and deleting reactions linked to each thought. It also includes the functionality to update the data of users or thoughts at any time. 

## User Story

```
AS A social media startup
I WANT an API for my social network that uses a NoSQL database
SO THAT my website can handle large amounts of unstructured data
```

## Acceptance Criteria

```
GIVEN a social network API
WHEN I enter the command to invoke the application
THEN my server is started and the Mongoose models are synced to the MongoDB database
WHEN I open API GET routes in Insomnia for users and thoughts
THEN the data for each of these routes is displayed in a formatted JSON
WHEN I test API POST, PUT, and DELETE routes in Insomnia
THEN I am able to successfully create, update, and delete users and thoughts in my database
WHEN I test API POST and DELETE routes in Insomnia
THEN I am able to successfully create and delete reactions to thoughts and add and remove friends to a user’s friend list
```

## Screenshots

![Create a User](/screenshots/create-user.png)
![Add a Friend to a User](/screenshots/add-friend.png)
![Find all Users](/screenshots/find-all-users.png)
![Show Reaction and linked Thought](/screenshots/create-reaction.png)

## Links

- [Walkthrough/Demonstration Video](https://youtu.be/u0ZkI_g8Tyw)
- [Github Repo](https://github.com/EthanC29/NoSQL-Social-Network-API)

## Contributions

GitHub: [@EthanC29](https://github.com/EthanC29)