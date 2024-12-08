import { Comment } from "../types";

function Comments({comments}: Readonly<{comments: Comment[]}>) {
    return <div className="border flex flex-col max-h-[450px] overflow-scroll gap-5 mb-5">
    {comments.map((comment, index) => {
      return (
        <div key={index} className="flex flex-col border">
          <div className="mb-5">
            {comment.author} posted at {comment.time}
          </div>
          <div>
            {comment.comment}
          </div>
        </div>
      );
    })}
  </div>
}
export default Comments