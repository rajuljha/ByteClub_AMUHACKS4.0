import { useState } from "react";
import axios from "axios"; 
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/utils/toast";

interface CreateQuizModalProps {
  onQuizCreated: (quizData: any) => void;
}

const CreateQuizModal = ({ onQuizCreated }: CreateQuizModalProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    topic: "",
    class: "",
    schoolBoard: "",
    numberOfQuestions: "10",
    timeInMinutes: "15",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Prepare the data for submission
    const quizData = {
      name: formData.name,
      subject: formData.topic,
      num_questions: parseInt(formData.numberOfQuestions),
      topic: formData.topic,
      difficulty_level: parseInt(formData.class), 
      exec_time: parseInt(formData.timeInMinutes),
    };

    try {
      
      const userInfo = localStorage.getItem("user");
      const user = JSON.parse(userInfo);
      const token = user.access_token;

      const response = await axios.post(
        "http://localhost:8000/quiz/quizzes/create",
        quizData,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      
      const newQuiz = response.data;

      // Handle the response
      onQuizCreated(newQuiz);
      toast.success("Quiz created successfully!");
      setIsLoading(false);
      setOpen(false);

      // Reset form data
      setFormData({
        name: "",
        topic: "",
        class: "",
        schoolBoard: "",
        numberOfQuestions: "10",
        timeInMinutes: "15",
      });
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Failed to create quiz. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-purple hover:bg-brand-purple/90">
          Create Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a New Quiz</DialogTitle>
            <DialogDescription>
              Fill in the details to create a quiz for your child.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Quiz Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Math Quiz"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Algebra"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="class">Class/Grade</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("class", value)}
                  value={formData.class}
                >
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                      <SelectItem key={grade} value={String(grade)}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="schoolBoard">School Board</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("schoolBoard", value)}
                  value={formData.schoolBoard}
                >
                  <SelectTrigger id="schoolBoard">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CBSE">CBSE</SelectItem>
                    <SelectItem value="ICSE">ICSE</SelectItem>
                    <SelectItem value="State">State Board</SelectItem>
                    <SelectItem value="IB">IB</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("numberOfQuestions", value)}
                  value={formData.numberOfQuestions}
                >
                  <SelectTrigger id="numberOfQuestions">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20, 25, 30].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="timeInMinutes">Time (minutes)</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("timeInMinutes", value)}
                  value={formData.timeInMinutes}
                >
                  <SelectTrigger id="timeInMinutes">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20, 30, 45, 60].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-brand-purple hover:bg-brand-purple/90">
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                "Create Quiz"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuizModal;
