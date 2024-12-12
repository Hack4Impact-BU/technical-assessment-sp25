<p align="center">
  <a href="" rel="noopener">
 <img src="withDatabaseAndHistory/frontend/src/assets/song-discussion-board_thumbnail.png" alt="Project logo"></a>
</p>

<h3 align="center">Random Songs Daily Discussion Board</h3>

<div align="center">

</div>

---


## 🧐 Submission Info <a name = "about"></a>
Hi! Here's my finished technical assessment for the impact team. It has been deployed at [https://benevolent-bonbon-e0ef4f.netlify.app/](https://benevolent-bonbon-e0ef4f.netlify.app/) for you to experience, with the backend deployed using heroku.  
 As required in the README submission instructions, I have provided a version of my web app that is "runnable" locally, in that it has no database and no mongoDB connect url, in the noDatabase folder. The noDatabase version refreshes comments and the 3 random songs on every page reload due to no database storage.  
 However, my finalised web app is in withDatabaseAndHistory and is the one I'm proud of (note that the frontend can run locally and be accessible, but no songs or comments will show due to the inability to start the backend without my mongoDB connect url). The finalised version has a mongoDB database, and persistent comment and song storage, and the ability to view songs and comments from previous days, as my video and deployed app both show. 

- [Link to Video of Running App](https://youtu.be/0g6sc1j6RPA)

### How it Went
Honestly, I think this assessment was actually a lot of fun. This is pretty much my first fullstack project on my own and I ended up feeling quite proud of it. I'm particularly proud with how I figured out how to display previous day's songs and comments, i.e. using a useState to set the date and useEffects to refresh the page's information depending on the date change. Overall, I also felt it was certainly quite challenging. My only experience with javascript comes from the JDT react workshops, and those were really fast paced, so there were a lot of things that I had to really figure out during the assessment itself, like props and react hooks. I won't lie, chatGPT helped a lot with giving advice and teaching react concepts to me in simpler terms, although I made sure that any code it provided me with I understood fully before implementing them in my app. For example, I couldn't entirely figure out how to call the GeniusAPI, and when I asked chatGPT about http calls to external APIs, it told me about axios. I then did my own research on axios, discovered fetch as an alternative, and then decided on my own to use axios as it made more sense for me. I also relied a lot on the JDT workshop slides as well as the website we made to build my app. This assessment was pretty much constant learning through actual experience, and even if I don't end up getting into the impact team it'll still have been incredibly valuable to me. 

### Feedback for next year's assessment
My only feedback is regarding the timing of this semester's assessment window being really awkward. The last week of class is definitely the most packed and stressful, so the extension of the deadline was a really good call. I know I would have submitted a half-done assessment without it. Maybe having the assessment be due over the break would be a good option?


## 🏁 Getting Started <a name = "getting_started"></a>
- run npm install from frontend and backend folder
- run npm run dev from frontend
- run npm start from backend

## ⛏️ Built Using <a name = "built_using"></a>

- [MongoDB](https://www.mongodb.com/) 
- [Express](https://expressjs.com/)
- [NodeJs](https://nodejs.org/en/)
- [ReactJs](https://react.dev/)
- [MaterialUI](https://mui.com/material-ui/)

## ✍️ Authors <a name = "authors"></a>

- [@julianl05](https://github.com/julianl05)


