import { Button, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

function CommentForm({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getData
}: Readonly<{
  getData: (comment: string, name: string, timestamp: string) => void;
}>) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // const formData = new FormData(e.currentTarget);
    // console.log(formData.get("name"));
    // console.log(formData.get("comment"));
    const date = new Date()

    // fetch
    console.log("Getting data")
    getData(name, comment, `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`)
    handleClose()
  };
  const handleClose = (): void => {
    setOpen(false)
  }
  return (
    <>
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add a comment</DialogTitle>
      <DialogContent>
      <form onSubmit={onSubmit}>
        <TextField id="name" name="name" label="Name" variant="outlined" value={name} onChange={(e) => setName(e.currentTarget.value)}/>
        <TextField
          id="comment"
          name="comment"
          label="Comment"
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.currentTarget.value)}
        />
        <Button type="submit" variant="text">Submit</Button>
      </form>
      </DialogContent>
    </Dialog>
    <Button type="button" variant="text" onClick={() => setOpen(true)}>Add a Comment</Button>
    </>
  );
}
export default CommentForm;
