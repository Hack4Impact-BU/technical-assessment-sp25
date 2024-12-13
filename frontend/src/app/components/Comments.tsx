import { Comment, CommentAggregatedData } from "../types";
import { FaCheck } from "react-icons/fa6";
function Comments({
  comments,
  frequentCommenters,
}: Readonly<{
  comments: Comment[] | undefined;
  frequentCommenters: CommentAggregatedData[] | undefined;
}>) {
  return (
    <div className="flex flex-col max-h-[450px] overflow-scroll gap-5 mb-5 px-4">
      {comments &&
        comments.map((comment, index) => {
          return (
            <div
              key={index}
              className="flex flex-col border-2 p-2 rounded-md bg-ctp-crust"
            >
              <div className="mb-5 flex items-center gap-5">
                <div className="flex items-center gap-1">
                  {comment.name}{" "}
                  {frequentCommenters?.some(
                    (comments) => comments.name.toLowerCase() == comment.name.toLowerCase()
                  ) && <FaCheck />}{" "}
                </div>
                posted at {comment.timestamp}
              </div>
              <div>{comment.comment}</div>
            </div>
          );
        })}
    </div>
  );
}
export default Comments;
