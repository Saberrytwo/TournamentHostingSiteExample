import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import "./TipTap.css";
import Toolbar from "./Toolbar.tsx";

function TipTap({
  description,
  onChange,
  label,
  required,
}: {
  description: string;
  onChange: any;
  label?: string;
  required?: boolean;
}) {
  let editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: "editor",
      },
    },
    onCreate: ({ editor }) => {
      editor.commands.setContent(description);
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      onChange(content);
    },
  });

  const editorContentRef = useRef(null);

  useEffect(() => {
    if (editor && editorContentRef.current) {
      editor.view.focus();
      editor.commands.setContent(description);
    }
  }, [description, editor]);

  return (
    <div className="d-flex flex-column justify-content-stretch text-editor" style={{ minHeight: "100px" }}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      {label && (
        <label className="label-floated-richtext">
          {label}
          {required ? <span className="required">*</span> : ""}
        </label>
      )}
    </div>
  );
}

export default TipTap;
