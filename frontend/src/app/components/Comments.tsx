import { Comment } from "../types";

function Comments({comments}: Readonly<{comments: Comment[]}>) {
    return <div className="border flex flex-col max-h-[450px] overflow-scroll gap-10 mb-5">
    {comments.map((comment, index) => {
      return (
        <div key={index} className="flex flex-col border">
          {comment.comment}
        </div>
      );
    })}
  </div>
}
export default Comments