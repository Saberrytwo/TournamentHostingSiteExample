import { type Editor } from "@tiptap/react";
import { Bold, Heading2, Italic, List, ListOrdered, Strikethrough } from "lucide-react";
import "./TipTap.css";

type Props = {
  editor: Editor | null;
};

export default function Toolbar({ editor }: Props) {
  //   if (!editor) return null;
  const toggleHeading = () => {
    // Get current selection
    const { selection } = editor.state;

    // Check if selection is collapsed and current node is a heading level 2
    if (selection && editor.isActive("heading", { level: 2 })) {
      // Change the current node to paragraph (default state)
      editor.chain().focus().setParagraph().run();
    } else {
      // Set heading level to 2
      editor.chain().focus().setHeading({ level: 2 }).run();
    }
  };
  return (
    <div className="toolbar-richtext">
      <button
        type="button"
        className="btn btn-light toolbar-btn"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold />
      </button>
      <button
        type="button"
        className="btn btn-light toolbar-btn"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic />
      </button>
      <button
        type="button"
        className="btn btn-light toolbar-btn"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough />
      </button>
      <button
        type="button"
        className="btn btn-light toolbar-btn"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List />
      </button>
      <button
        type="button"
        className="btn btn-light toolbar-btn"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered />
      </button>
      <button type="button" className="btn btn-light toolbar-btn" onClick={toggleHeading}>
        <Heading2 />
      </button>
    </div>
  );
}
