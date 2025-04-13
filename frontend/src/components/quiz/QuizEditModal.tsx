import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ChevronLeft, ChevronRight, Save, Pencil } from "lucide-react";
import { toast } from "@/utils/toast";

interface RawQuestion {
  question: string;
  choice_A: string;
  choice_B: string;
  choice_C: string;
  choice_D: string;
  correctAnswer: string; // e.g., "choice_B"
}

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
}

interface QuizEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizName: string;
  questions: RawQuestion[];
  onSave: (questions: RawQuestion[]) => void;
}

const optionLabels = ["A", "B", "C", "D"];
const optionKeys = ["choice_A", "choice_B", "choice_C", "choice_D"];

const QuizEditModal = ({
  open,
  onOpenChange,
  quizName,
  questions,
  onSave
}: QuizEditModalProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [editedQuestions, setEditedQuestions] = useState<Question[]>([]);

  const form = useForm({
    defaultValues: {
      questionText: "",
      correctOptionId: "",
      options: ["", "", "", ""]
    }
  });

  // Convert raw question format to internal format
  const mapRawToEditable = (raw: RawQuestion[], reset: boolean = false): Question[] =>
    raw.map((q, index) => ({
      id: `q-${index}`,
      text: q.question,
      options: optionKeys.map(key => ({
        id: key,
        text: q[key]
      })),
      correctOptionId: q.correctAnswer
    }));

  // Convert back to original format on save
  const mapEditableToRaw = (editable: Question[]): RawQuestion[] =>
    editable.map(q => {
      const raw: any = {
        question: q.text,
        correctAnswer: q.correctOptionId
      };
      q.options.forEach(option => {
        raw[option.id] = option.text;
      });
      return raw as RawQuestion;
    });

  const loadQuestionToForm = (index: number) => {
    const question = editedQuestions[index];
    form.reset({
      questionText: question.text,
      correctOptionId: question.correctOptionId,
      options: question.options.map(opt => opt.text)
    });
  };

  const updateCurrentQuestion = () => {
    const values = form.getValues();
    const updatedQuestion: Question = {
      ...editedQuestions[currentQuestionIndex],
      text: values.questionText,
      correctOptionId: values.correctOptionId,
      options: editedQuestions[currentQuestionIndex].options.map((option, idx) => ({
        ...option,
        text: values.options[idx] || ""
      }))
    };
    const updated = [...editedQuestions];
    updated[currentQuestionIndex] = updatedQuestion;
    setEditedQuestions(updated);
  };

  const handlePrevious = () => {
    updateCurrentQuestion();
    const newIndex = Math.max(0, currentQuestionIndex - 1);
    setCurrentQuestionIndex(newIndex);
    loadQuestionToForm(newIndex);
  };

  const handleNext = () => {
    updateCurrentQuestion();
    const newIndex = Math.min(editedQuestions.length - 1, currentQuestionIndex + 1);
    setCurrentQuestionIndex(newIndex);
    loadQuestionToForm(newIndex);
  };

  const handleSaveAll = () => {
    updateCurrentQuestion();
    const rawFormatted = mapEditableToRaw(editedQuestions);
    onSave(rawFormatted);
    toast.success("Quiz questions updated successfully!");
    onOpenChange(false);
  };

  useEffect(() => {
    if (open && questions.length > 0) {
      const editable = mapRawToEditable(questions);
      setEditedQuestions(editable);
      setCurrentQuestionIndex(0);
      form.reset({
        questionText: editable[0].text,
        correctOptionId: editable[0].correctOptionId,
        options: editable[0].options.map(opt => opt.text)
      });
    }
  }, [open, questions]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Pencil className="h-5 w-5" /> Edit Quiz Questions: {quizName}
          </DialogTitle>
        </DialogHeader>

        {editedQuestions.length > 0 ? (
          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium">
                Question {currentQuestionIndex + 1} of {editedQuestions.length}
              </div>
            </div>

            <Form {...form}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="questionText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter question text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label className="mb-2 block">Options</Label>
                  {form.getValues().options.map((_, index) => {
                    const optionId = editedQuestions[currentQuestionIndex].options[index].id;

                    return (
                      <div key={index} className="flex items-center mb-3 gap-2">
                        <FormField
                          control={form.control}
                          name="correctOptionId"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex items-center"
                                >
                                  <RadioGroupItem
                                    value={optionId}
                                    id={`option-${index}`}
                                  />
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="w-5 font-medium">{optionLabels[index]}.</div>

                        <FormField
                          control={form.control}
                          name={`options.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder={`Option ${index + 1}`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    );
                  })}
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    Select the radio button next to the correct answer
                  </div>
                </div>
              </div>
            </Form>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>

              <Button
                variant="outline"
                onClick={handleNext}
                disabled={currentQuestionIndex === editedQuestions.length - 1}
                className="gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No questions available to edit.
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={handleSaveAll}
            className="gap-1 bg-brand-purple hover:bg-purple-700"
          >
            <Save className="h-4 w-4" /> Save All Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuizEditModal;
