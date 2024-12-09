# Jordan's Spring 2025 Hack4Impact Technical Assessment Project

## Features

- **Displays 3 random songs from the Genius API**
- **Allows users to comment on the songs that are currently featured**
- **Has a history of all the songs that have been featured in the past**
- **Gives users with 3 or more comments a verification badge**
- **Allows users to vote on their favorite song and then displays the most voted song when the day ends**

## Running the Project

### Frontend

1. Clone the repository

```bash
git clone https://github.com/JorYin/technical-assessment-sp25.git
```

2. Navigate to the `client` directory

```bash
cd client
```

3. Install the dependencies

```bash
npm install
```

4. Start the development server

```bash
npm run dev
```

### Backend

1. Navigate to the `server` directory

```bash
cd backend
```

2. Install the dependencies

```bash
npm install
```

3. Add a `.env` file to the `server` directory where
   GENIUS_TOKEN = will be the auth token for the GENIUS API
   MONGO_URL = will be the mongoDB connection string

5. Start the development server

```bash
nodemon index.js
```

## Technologies Used

### Frontend

- **Typescript**
- **React.js**
- **Axios**
- **Tailwind**

### Backend

- **Javascript**
- **Express.js**
- **Node.js**
- **MongoDB**

## Application Questions

### Demo Link

[Demo Video](https://www.loom.com/share/4efa97edb6e0488799d0fca6ca89c1af?sid=3b9e03a2-3507-4a43-93c1-62de39b614de)

### How the project went

The project went well besides a few blocks like with the api req because I had a typo or hosting the application. I was able to learn more about mongoDB queries and put into practice what I have been learning in 460. The most challenging thing for me was coming up with the edge cases and how to query the database along with the conditional logic since I required some planning. Along with setting up my schema since it did change through the course of making the project. 

### What I would change about the next assessment

I think overall the project is a fair assessment of your skill and I think extending the due date like now would be better since it is a somewhat complex project.
