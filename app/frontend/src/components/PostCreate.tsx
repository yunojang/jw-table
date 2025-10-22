import type { PostBase } from "@/types";
import Button from "./UI/Button";
import { Input } from "./UI/Input";
import { TextArea } from "./UI/TextArea";
import useForm from "@/hooks/useForm";

import { forwardRef, useImperativeHandle, useRef } from "react";

export interface PostCreateHandle {
  focusTitle: () => void;
}

interface PostCreateProps {
  onSubmit: (values: PostBase) => void;
  onCancel: () => void;
  disabled?: boolean;
}

const PostCreate = forwardRef<PostCreateHandle, PostCreateProps>(
  ({ onSubmit, onCancel, disabled = false }, ref) => {
  const { values, handleChange } = useForm({ title: "", content: "" });
    const titleRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => ({
      focusTitle() {
        titleRef.current?.focus();
      },
    }));

    return (
      <div className="relative overflow-hidden neon-card rounded-2xl p-6 py-12 max-w-5xl mx-auto">
        <div className="relative z-10">
          <h1 className="text-xl font-extrabold tracking-tight text-white">
            새 글 작성
          </h1>
          <p className="mt-2 text-sm text-fuchsia-100/80">
            떠오르는 생각을 기록해 보세요. 완벽하지 않아도 괜찮아요!
          </p>
          <div className="mt-6 space-y-4">
            <div className="sparkle-field p-0.5 rounded-2xl">
              <Input
                ref={titleRef}
                name="title"
                value={values.title}
                onChange={handleChange}
                placeholder="제목"
              />
            </div>
            <div className="sparkle-field p-0.5 rounded-2xl">
              <TextArea
                name="content"
                value={values.content}
                onChange={handleChange}
                placeholder="본문을 입력하세요"
              />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-2">
            <Button variant="flat" onClick={onCancel}>
              취소
            </Button>
            <Button onClick={() => onSubmit(values)} disabled={disabled}>
              {disabled ? "등록 중..." : "등록"}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

PostCreate.displayName = "PostCreate";

export default PostCreate;
