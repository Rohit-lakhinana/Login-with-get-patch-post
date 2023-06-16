import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService } from 'src/app/account.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  size = 10;
  questions: any[] = [];
  questionForm!: FormGroup;
  token: any;
  apiEndpoint = 'https://dev.platformcommons.org/gateway/assessment-service/api/v1/questions';

  questionArray: FormArray<FormGroup<any>> = new FormArray<FormGroup<any>>([]);

  constructor(
    private formBuilder: FormBuilder,
    private accService: AccountService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.token = sessionStorage.getItem('token');
    this.retrieveStoredQuestions();
    this.fetchQuestions('fetch');

    this.questionForm = this.formBuilder.group({
      questionText: ['', Validators.required],
      code: ['', Validators.required],
      weight: ['', Validators.required],
      questionArray: this.questionArray 
    });

    this.questionArray = this.questionForm.get('questionArray') as FormArray<FormGroup<any>>; // Initialize questionArray property
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
      Authorization: `Bearer ${this.token}`
    });

    if (typeof id === 'number') {
      this.questions = this.questions.filter(values => values.id !== id);
    } else {
      this.http.get(`${this.apiEndpoint}?page=10&size=${this.size}`, { headers }).subscribe(
        (response) => {
          this.questions = response as any[];
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
      Authorization: `Bearer ${this.token}`
    });

    const updatedFormData = {
      id: question.id,
      tenant: 0,
      domain: 'DOMAIN.HEALTH',
      questionCode: question.questionCode,
      questionClass: {
        code: 'QUESTION_CLASS.QUESTION'
      },
      questionType: {
        code: 'QUESTION_TYPE.SUBJECTIVE_LONG'
      },
      questionText: [
        {
          text: question.questionText[0].text,
          language: {
            code: 'ENG',
            label: 'English'
          }
        }
      ],
      questionSubText: [
        {
          text: '',
          language: {
            code: 'ENG',
            label: 'English'
          }
        }
      ],
      questionName: [],
      weight: question.weight,
      tenantId: 0,
      questionImageURL: '',
      defaultOptionsList: [],
      questionSubtype: {
        code: 'QUESTION_SUB_TYPE.SUBJECTIVE'
      }
    };

    this.http.patch(this.apiEndpoint, updatedFormData, { headers }).subscribe(
      () => {
        console.log('Question updated');
        question.editMode = false;
        this.storeQuestionsInSessionStorage();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteQuestion(id: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    this.http.delete(`${this.apiEndpoint}/${id}`, { headers }).subscribe(
      () => {
        console.log('Question deleted');
        this.fetchQuestions(id);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  submitQuestion() {
   console.log(this.questionForm)
   return
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
  
    const questionData = {
      id: 0,
      tenant: 0,
      domain: 'DOMAIN.HEALTH',
      questionCode: 'FB_001',
      questionClass: {
        code: 'QUESTION_CLASS.QUESTION'
      },
      questionType: {
        code: 'QUESTION_TYPE.SUBJECTIVE_LONG'
      },
      questionText: [
        {
          text: this.questionForm.value.questionText,
          language: {
            code: 'ENG',
            label: 'English'
          }
        }
      ],
      questionSubText: [
        {
          text: '',
          language: {
            code: 'ENG',
            label: 'English'
          }
        }
      ],
      questionName: [],
      weight: this.questionForm.value.weight,
      tenantId: 0,
      questionImageURL: '',
      defaultOptionsList: [],
      questionSubtype: {
        code: 'QUESTION_SUB_TYPE.SUBJECTIVE'
      },
      questionArray: this.questionArray.value // Add questionArray property
    };
  
    this.http.post(this.apiEndpoint, questionData, { headers }).subscribe(
      () => {
        console.log('Question submitted');
        this.questionForm.reset();
        this.questionArray.clear();
        this.fetchQuestions('fetch');
      },
      (error) => {
        console.error(error);
        console.log(error.errorCode);
        console.log(error.errorMessage);
      }
    );
  }

  addQuestion() {
    const control = this.formBuilder.group({
      questionText: ['', Validators.required],
      code: ['', Validators.required],
      weight: ['', Validators.required]
    });
    this.questionArray.push(control);
  }

  removeQuestion(index: number) {
    this.questionArray.removeAt(index);
  }
}