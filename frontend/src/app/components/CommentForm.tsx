import { Button, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

function CommentForm({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getData
}: Readonly<{
  getData: (comment: string) => void;
}>) {
  const [open, setOpen] = useState(false)
  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData.get("name"));
    console.log(formData.get("comment"));
    // fetch
    
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
        <TextField id="name" name="name" label="Name" variant="outlined" />
        <TextField
          id="comment"
          name="comment"
          label="Comment"
          variant="outlined"
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
