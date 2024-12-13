import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

function CommentForm({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getData,
  song_titles,
}: Readonly<{
  getData: (
    comment: string,
    name: string,
    timestamp: string,
    favorite_song: string
  ) => void;
  song_titles: string[];
}>) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl)
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [favoriteSong, setFavoriteSong] = useState("Click to vote for your favorite song!"); // button text for the vote function is controlled by this state
  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const date = new Date();
    // fetch
    getData(
      name,
      comment,
      `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`,
      favoriteSong != "Click to vote for your favorite song!" ? favoriteSong : ''
    );
    handleClose();
  };
  const handleClose = (): void => {
    setName("");
    setComment("");
    setFavoriteSong("Click to vote for your favorite song!");
    setOpen(false);
  };
  const menuHandleClose = (): void => {
    setAnchorEl(null)
  }
  const menuOnClick = (favorite_song: string): void => {
    setFavoriteSong(favorite_song)
    setAnchorEl(null)
  }
  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Add a comment</DialogTitle>
        <DialogContent>
          <form onSubmit={onSubmit} className="p-5 flex flex-col gap-5">
            <TextField
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              value={name}
              required={true}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <TextField
              id="comment"
              name="comment"
              label="Comment"
              variant="outlined"
              value={comment}
              required={true}
              onChange={(e) => setComment(e.currentTarget.value)}
            />
            <label htmlFor="basic-button">Favorite song?</label>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              {favoriteSong}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={menuHandleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {song_titles.map((title, index) => {
                return (
                  <MenuItem key={index} onClick={() => menuOnClick(title)}>{title}</MenuItem>
                )
              })}
            </Menu>
            <Button type="submit" variant="outlined">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Button type="button" variant="contained" onClick={() => setOpen(true)}>
        Add a Comment
      </Button>
    </>
  );
}
export default CommentForm;
