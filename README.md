# Khoa's Spring 2025 Hack4Impact Technical Assessment Project

## Features

- **Displays 3 random songs from the Genius API**
- **Allows users to comment on the songs that are currently featured**
- **Has a history of all the songs that have been featured in the past**
- **Gives users with 3 or more comments a top-contributor badge**
- **Allows users to vote on their favorite song and hightlights the song with the most vote when users visit previous days**

## Running the Project

### Frontend

1. Clone the repository

```bash
git clone git@github.com:koacow/kcao-technical-assessment-sp25.git
```

2. Navigate to the `frontend` directory

```bash
cd frontend
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

1. Navigate to the `backend` directory

```bash
cd backend
```

2. Install the dependencies

```bash
npm install
```

3. Add a `.env` file using the `example.env` file as a template

4. Start the development server

```bash
npm start
```


## Technologies Used

### Frontend

- **Typescript**
- **React.js**
- **Material-UI**
- **Axios**
- **React-Query**
- **Tailwind**

### Backend

- **Typescript**
- **Express.js**
- **Node.js**
- **PostgreSQL**

## Application Questions

### Demo Link

[Demo Video](https://drive.google.com/file/d/1LZFqRsOi98Q_cq7F-jbXirPNeMe45evE/view?usp=sharing)

### How the project went

The project went quite well, I was able to implement most of the bonus features along with the required ones. This was also a learning experience for me as it was the first project I built entirely with TypeScript and React-Query. I thought it was a challenging but rewarding experience as it required some critical thinking - especially when it came to the voting feature, fetching random songs, and displaying the top contributor badge - rather than mindlessly making API requests and displaying the response.

### What I would change about the next assessment

I think this project was well scoped and the requirements were well outlined without being too restrictive. I wouldn't change anything about the next assessment.
