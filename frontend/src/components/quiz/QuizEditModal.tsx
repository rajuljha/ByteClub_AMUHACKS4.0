
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import { ChevronLeft, ChevronRight, Save, Plus, Minus, Pencil } from "lucide-react";
import { toast } from "@/utils/toast";

interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
}

interface QuizEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizName: string;
  questions: Question[];
  onSave: (questions: Question[]) => void;
}

const QuizEditModal = ({ open, onOpenChange, quizName, questions, onSave }: QuizEditModalProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [editedQuestions, setEditedQuestions] = useState<Question[]>(questions);
  
  const form = useForm({
    defaultValues: {
      questionText: questions[0]?.text || "",
      correctOptionId: questions[0]?.correctOptionId || "",
      options: questions[0]?.options.map(option => option.text) || ["", "", "", ""]
    }
  });

  const updateCurrentQuestion = () => {
    // Save current form values to the editedQuestions array
    const values = form.getValues();
    
    const updatedQuestion: Question = {
      ...editedQuestions[currentQuestionIndex],
      text: values.questionText,
      correctOptionId: values.correctOptionId,
      options: editedQuestions[currentQuestionIndex].options.map((option, index) => ({
        id: option.id,
        text: values.options[index] || ""
      }))
    };
    
    const updatedQuestions = [...editedQuestions];
    updatedQuestions[currentQuestionIndex] = updatedQuestion;
    setEditedQuestions(updatedQuestions);
  };

  const handlePrevious = () => {
    updateCurrentQuestion();
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
    loadQuestionToForm(currentQuestionIndex - 1);
  };

  const handleNext = () => {
    updateCurrentQuestion();
    setCurrentQuestionIndex(prev => Math.min(editedQuestions.length - 1, prev + 1));
    loadQuestionToForm(currentQuestionIndex + 1);
  };

  const loadQuestionToForm = (index: number) => {
    if (index >= 0 && index < editedQuestions.length) {
      const question = editedQuestions[index];
      form.reset({
        questionText: question.text,
        correctOptionId: question.correctOptionId,
        options: question.options.map(option => option.text)
      });
    }
  };

  const handleSaveAll = () => {
    // Update the current question before saving all
    updateCurrentQuestion();
    onSave(editedQuestions);
    toast.success("Quiz questions updated successfully!");
    onOpenChange(false);
  };

  // When the modal opens or questions change, reset the form with the first question
  React.useEffect(() => {
    if (open && questions.length > 0) {
      setEditedQuestions(questions);
      setCurrentQuestionIndex(0);
      loadQuestionToForm(0);
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
                  {form.getValues().options.map((_, index) => (
                    <div key={index} className="flex items-center mb-3 gap-2">
                      <FormField
                        control={form.control}
                        name={`correctOptionId`}
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                value={field.value}
                                className="flex items-center"
                              >
                                <RadioGroupItem 
                                  value={editedQuestions[currentQuestionIndex].options[index].id} 
                                  id={`option-${index}`} 
                                />
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`options.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder={`Option ${index + 1}`} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
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
          <Button onClick={handleSaveAll} className="gap-1 bg-brand-purple hover:bg-purple-700">
            <Save className="h-4 w-4" /> Save All Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuizEditModal;
