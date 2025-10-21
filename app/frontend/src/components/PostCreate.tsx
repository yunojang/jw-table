import type { PostBase } from "@/types";
import Button from "./UI/Button";
import { Input } from "./UI/Input";
import { TextArea } from "./UI/TextArea";
import useForm from "@/hooks/useForm";

function PostCreate({
  onSubmit,
  onCancel,
  disabled = false,
}: {
  onSubmit: (values: PostBase) => void;
  onCancel: () => void;
  disabled?: boolean;
}) {
  const { values, handleChange } = useForm({ title: "", content: "" });

  return (
    <div className="neon-card rounded-2xl p-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-xl font-extrabold">새 글 작성</h1>
      <div className="mt-4 space-y-3">
        <Input
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="제목"
        />
        {/* <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="태그(쉼표로 구분: 예) 신작, 스포주의)"
        /> */}
        <TextArea
          name="content"
          value={values.content}
          onChange={handleChange}
          placeholder="본문을 입력하세요"
        />
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button variant="flat" onClick={onCancel}>
          취소
        </Button>
        <Button onClick={() => onSubmit(values)} disabled={disabled}>
          {disabled ? "등록 중..." : "등록"}
        </Button>
      </div>
    </div>
  );
}

export default PostCreate;
