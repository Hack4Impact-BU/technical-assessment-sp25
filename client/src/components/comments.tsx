import VerifySVG from "./verifySVG"

interface commentProps {
  name: string,
  commentText: string,
  isVerified: Boolean
}

/*
  Comment component that takes in the name of the user and the comment they have posted as parameters
*/
const Comment = ({ name, commentText, isVerified}: commentProps) => {
  return (
    <div className="mt-5 rounded-lg">
      <div className="flex items-center">
        <p className="text-xl font-bold">{name}</p>
        <div className={`${isVerified ? "block" : "hidden"}`}>
          <VerifySVG />
        </div>
      </div>
      <div className="bg-slate-200 p-2 mt-1 rounded-lg">
        <p>{commentText}</p>
      </div>
    </div>
  );
};

export default Comment;
