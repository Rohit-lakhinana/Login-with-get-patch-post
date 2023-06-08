import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  size = 10;
  questions: any[] = [];
  questionText: string | undefined;
  code: string | undefined;
  weight: string | undefined;
  token: any;
  apiEndpoint: string = 'https://dev.platformcommons.org/gateway/assessment-service/api/v1/questions';

  constructor(private http: HttpClient) {}

  ngOnInit() {
   this.token= sessionStorage.getItem("token");
    this.retrieveStoredQuestions();
    this.fetchQuestions('fetch');
  }

  retrieveStoredQuestions() {
    const storedQuestions = sessionStorage.getItem('questions');
    if (storedQuestions) {
      this.questions = JSON.parse(storedQuestions);
    }
  }

  storeQuestionsInSessionStorage() {
    sessionStorage.setItem('questions', JSON.stringify(this.questions));
  }


  fetchQuestions(id: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    if (typeof id === 'number') {
      this.questions = this.questions.filter((values) => {
        return values.id !== id;
      });
    } else {
      this.http.get(`${this.apiEndpoint}?page=10&size=${this.size}`, { headers })
        .subscribe(
          (response) => {
            this.questions = response as any[];
            //sessionStorage.setItem('questions', JSON.stringify(this.questions));
             this.storeQuestionsInSessionStorage();
            
          },
          (error) => {
            console.error(error);
          }
        );
    }

    this.questions.forEach((question) => {
      question.editMode = false;
    });
  }

  editQuestion(question: any) {
    question.editMode = true;
  }

  saveQuestion(question: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    const updatedFormData = {
      // Updated form data here
      uuid: '',
      id: 269,
      defaultOptionsList: [],
      questionComprehensionList: [],
      domain: 'DOMAIN.HEALTH',
      ltldskillList: [],
      questionClass: {
        code: 'QUESTION_CLASS.QUESTION',
        labels: [
          {
            id: 3,
            text: 'Question class question',
            language: {
              code: 'ENG',
              label: 'English'
            }
          }
        ],
        refClass: {
          code: 'REF.QUESTION_CLASS'
        }
      },
      questionCode: 'FB_001',
      questionName: [],
      questionSubtype: {
        code: 'QUESTION_SUB_TYPE.SUBJECTIVE',
        labels: [
          {
            id: 5,
            text: 'Question sub type subjective',
            language: {
              code: 'ENG',
              label: 'English'
            }
          }
        ],
        refClass: {
          code: 'REF.QUESTION_SUB_TYPE'
        }
      },
      questionText: [
        {
          id: 1861,
          text: 'non editable',
          language: {
            code: 'ENG',
            label: 'English'
          }
        }
      ],
      questionSubText: [
        {
          id: 1860,
          text: '',
          language: {
            code: 'ENG',
            label: 'English'
          }
        }
      ],
      questionType: {
        code: 'QUESTION_TYPE.NUMBER',
        labels: [
          {
            id: 324,
            text: 'Number',
            language: {
              code: 'ENG',
              label: 'English'
            }
          }
        ],
        refClass: {
          code: 'REF.QUESTION_TYPE'
        }
      },
      tenant: 0,
      weight: 1,
      enteredQuestionText: this.questionText,
      enteredCode: this.code,
      enteredWeight: this.weight 
    };

    

    this.http.patch(this.apiEndpoint, updatedFormData, { headers })
      .subscribe(
        (response) => {
          console.log('Question updated');
          question.editMode = false;
        },
        (error) => {
          console.error('Error updating question:', error);
        }
      );
  }

  submitQuestion() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    const formData = {
      // Form data here
      uuid: 'b4dea6d3-f82f-434d-8d38-7d70e8c1742c',
      id: 269,
      defaultOptionsList: [],
      questionComprehensionList: [],
      domain: 'DOMAIN.HEALTH',
      ltldskillList: [],
      questionClass: {
        code: 'QUESTION_CLASS.QUESTION',
        labels: [
          {
            id: 3,
            text: 'Question class question',
            language: {
              code: 'ENG',
              label: 'English'
            }
          }
        ],
        refClass: {
          code: 'REF.QUESTION_CLASS'
        }
      },
      questionCode: 'FB_001',
      questionName: [],
      questionSubtype: {
        code: 'QUESTION_SUB_TYPE.SUBJECTIVE',
        labels: [
          {
            id: 5,
            text: 'Question sub type subjective',
            language: {
              code: 'ENG',
              label: 'English'
            }
          }
        ],
        refClass: {
          code: 'REF.QUESTION_SUB_TYPE'
        }
      },
      questionText: [
        {
          id: 1861,
          text: 'non editable',
          language: {
            code: 'ENG',
            label: 'English'
          }
        }
      ],
      questionSubText: [
        {
          id: 1860,
          text: '',
          language: {
            code: 'ENG',
            label: 'English'
          }
        }
      ],
      questionType: {
        code: 'QUESTION_TYPE.NUMBER',
        labels: [
          {
            id: 324,
            text: 'Number',
            language: {
              code: 'ENG',
              label: 'English'
            }
          }
        ],
        refClass: {
          code: 'REF.QUESTION_TYPE'
        }
      },
      tenant: 0,
      weight: 1,
      enteredQuestionText: this.questionText,
      enteredCode: this.code,
      enteredWeight: this.weight 
    };

    this.http.post(this.apiEndpoint, formData, { headers })
      .subscribe(
        (response) => {
          console.log(response);
          this.fetchQuestions('post');
        },
        (error) => {
          console.error(error);
        }
      );
  }

  deleteQuestion(questionId: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.delete(`${this.apiEndpoint}/${questionId}`, { headers })
      .subscribe(
        (response) => {
          console.log(`Question ${questionId} deleted`);
          this.fetchQuestions(questionId);
        },
        (error) => {
          console.error(error, "DELETE ERROR");
        }
      );
  }
}
