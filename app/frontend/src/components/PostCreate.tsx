import { useState } from "react";
import Button from "./UI/Button";
import { Input } from "./UI/Input";
import { TextArea } from "./UI/TextArea";

function PostCreate({
  onSubmit,
  onCancel,
}: {
  onSubmit: (title: string, body: string, tags: string[]) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="neon-card rounded-2xl p-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-xl font-extrabold">새 글 작성</h1>
      <div className="mt-4 space-y-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
        />
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="태그(쉼표로 구분: 예) 신작, 스포주의)"
        />
        <TextArea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="본문을 입력하세요"
        />
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button variant="flat" onClick={onCancel}>
          취소
        </Button>
        <Button
          onClick={() =>
            onSubmit(
              title.trim(),
              body.trim(),
              tags
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        >
          등록
        </Button>
      </div>
    </div>
  );
}

export default PostCreate;
