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

  questionArray: FormArray<FormGroup<any>> = new FormArray<FormGroup<any>>([]);

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
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

    this.loadQuestionsFromJSON(); // Load questions from JSON file
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
    if (typeof id === 'number') {
      this.questions = this.questions.filter(values => values.id !== id);
    } else {
      this.accountService.fetchQuestions(this.token, this.size).subscribe(
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
    this.accountService.updateQuestion(this.token, question).subscribe(
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
    this.accountService.deleteQuestion(this.token, id).subscribe(
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
    console.log(this.questionForm);
    return;

    const questionData = {
      // questionData properties...
    };

    this.accountService.submitQuestion(this.token, questionData).subscribe(
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

  loadQuestionsFromJSON() {
    this.http.get<any[]>('/assets/questions.json').subscribe(
      (response) => {
        this.questions = response as any[];
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
