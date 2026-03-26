'use client';
import React, { useState } from "react";
import { Upload, X, Plus, Trash2, Youtube, ClipboardList } from "lucide-react";
import type { ResourceType, GenreType, DifficultyLevel, CreateResourceDTO, Question, QuestionType } from "@/types/resource.types";

type ResourceUploadFormProps = {
  onSubmit: (data: CreateResourceDTO) => Promise<void>;
  onCancel: () => void;
};

const GENRES: GenreType[] = [
  'Programming',
  'Music',
  'Audio Engineering',
  'Business',
  'Languages',
  'Design',
  'Marketing',
  'Science',
  'Mathematics',
  'Arts',
];

const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
];

const ResourceUploadForm: React.FC<ResourceUploadFormProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('PDF');
  const [selectedGenres, setSelectedGenres] = useState<GenreType[]>([]);
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // PDF specific
  const [file, setFile] = useState<File | null>(null);
  
  // Video specific
  const [youtubeUrl, setYoutubeUrl] = useState('');
  
  // Exercise specific
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (selectedGenres.length === 0) {
      newErrors.genres = 'Please select at least one genre';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (resourceType === 'PDF') {
      if (!file) {
        newErrors.file = 'Please upload a PDF file';
      } else if (!file.type.includes('pdf')) {
        newErrors.file = 'Only PDF files are allowed';
      } else if (file.size > 50 * 1024 * 1024) { // 50MB limit
        newErrors.file = 'File size must be less than 50MB';
      }
    } else if (resourceType === 'Video') {
      if (!youtubeUrl.trim()) {
        newErrors.youtubeUrl = 'Please enter a YouTube URL';
      } else if (!isValidYoutubeUrl(youtubeUrl)) {
        newErrors.youtubeUrl = 'Please enter a valid YouTube URL';
      }
    } else if (resourceType === 'Exercise') {
      if (questions.length === 0) {
        newErrors.questions = 'Please add at least one question';
      } else {
        const hasInvalidQuestion = questions.some(q => !q.question.trim());
        if (hasInvalidQuestion) {
          newErrors.questions = 'All questions must have a question text';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidYoutubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const toggleGenre = (genre: GenreType) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
    setErrors(prev => ({ ...prev, genres: '' }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'Multiple Choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, ...updates } : q)));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    
    setIsSubmitting(true);
    
    try {
      const data: CreateResourceDTO = {
        title,
        description,
        genre: selectedGenres,
        resourceType,
        tags,
        difficultyLevel,
        status: 'Published',
      };
      
      if (resourceType === 'PDF' && file) {
        data.file = file;
      } else if (resourceType === 'Video') {
        data.youtubeUrl = youtubeUrl;
      } else if (resourceType === 'Exercise') {
        data.exercise = {
          questions,
        };
      }
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      
      await onSubmit(data);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      // Reset form
      setTimeout(() => {
        setUploadProgress(0);
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      setUploadProgress(0);
      console.error('Upload error:', error);
    }
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-gray-900/95 backdrop-blur-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-gray-900/95 p-6 backdrop-blur-xl">
          <div>
            <h2 className="text-2xl font-bold text-white">Publish New Resource</h2>
            <p className="mt-1 text-sm text-white/50">
              Step {step} of 2: {step === 1 ? 'Basic Information' : 'Resource Details'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${step * 50}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  className={`w-full rounded-lg border ${
                    errors.title ? 'border-red-500' : 'border-white/[0.08]'
                  } bg-white/[0.04] px-4 py-2.5 text-white placeholder-white/40 transition-all focus:border-blue-500/50 focus:outline-none`}
                  placeholder="Enter resource title..."
                />
                {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrors(prev => ({ ...prev, description: '' }));
                  }}
                  rows={4}
                  className={`w-full rounded-lg border ${
                    errors.description ? 'border-red-500' : 'border-white/[0.08]'
                  } bg-white/[0.04] px-4 py-2.5 text-white placeholder-white/40 transition-all focus:border-blue-500/50 focus:outline-none`}
                  placeholder="Describe your resource..."
                />
                {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
              </div>

              {/* Resource Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Resource Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['PDF', 'Video', 'Exercise'] as ResourceType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setResourceType(type)}
                      className={`rounded-lg border p-4 text-center transition-all ${
                        resourceType === type
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-white/[0.08] bg-white/[0.04] text-white/60 hover:border-white/[0.14] hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="text-sm font-medium">{type}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Genres */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Genres <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        selectedGenres.includes(genre)
                          ? 'bg-blue-500 text-white'
                          : 'border border-white/[0.08] bg-white/[0.04] text-white/60 hover:border-white/[0.14] hover:bg-white/[0.07]'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
                {errors.genres && <p className="mt-1 text-xs text-red-400">{errors.genres}</p>}
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Difficulty Level (Optional)
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {DIFFICULTY_LEVELS.map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficultyLevel(level)}
                      className={`rounded-lg border p-3 text-center text-xs font-medium transition-all ${
                        difficultyLevel === level
                          ? 'border-green-500 bg-green-500/20 text-white'
                          : 'border-white/[0.08] bg-white/[0.04] text-white/60 hover:border-white/[0.14] hover:bg-white/[0.07]'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white">Tags (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-white placeholder-white/40 transition-all focus:border-blue-500/50 focus:outline-none"
                    placeholder="Add tags..."
                  />
                  <button
                    onClick={handleAddTag}
                    className="rounded-lg bg-blue-500 px-4 py-2.5 text-white transition-colors hover:bg-blue-600"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-400"
                      >
                        #{tag}
                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-blue-300">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              {resourceType === 'PDF' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Upload PDF <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`cursor-pointer rounded-lg border-2 border-dashed ${
                      errors.file ? 'border-red-500' : 'border-white/[0.08]'
                    } bg-white/[0.04] p-8 text-center transition-all hover:border-blue-500/50 hover:bg-white/[0.06]`}
                  >
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <Upload className="mx-auto mb-3 h-12 w-12 text-white/40" />
                      {file ? (
                        <div>
                          <p className="text-sm font-medium text-white">{file.name}</p>
                          <p className="mt-1 text-xs text-white/40">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-white">Click to upload PDF</p>
                          <p className="mt-1 text-xs text-white/40">Max size: 50MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.file && <p className="mt-1 text-xs text-red-400">{errors.file}</p>}
                </div>
              )}

              {resourceType === 'Video' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    YouTube URL <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500" />
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => {
                        setYoutubeUrl(e.target.value);
                        setErrors(prev => ({ ...prev, youtubeUrl: '' }));
                      }}
                      className={`w-full rounded-lg border ${
                        errors.youtubeUrl ? 'border-red-500' : 'border-white/[0.08]'
                      } bg-white/[0.04] px-4 py-2.5 pl-11 text-white placeholder-white/40 transition-all focus:border-blue-500/50 focus:outline-none`}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                  {errors.youtubeUrl && <p className="mt-1 text-xs text-red-400">{errors.youtubeUrl}</p>}
                  <p className="mt-2 text-xs text-white/40">
                    The video will be published to YouTube through our API integration
                  </p>
                </div>
              )}

              {resourceType === 'Exercise' && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <label className="text-sm font-medium text-white">
                      Questions <span className="text-red-500">*</span>
                    </label>
                    <button
                      onClick={addQuestion}
                      className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-600"
                    >
                      <Plus className="h-4 w-4" />
                      Add Question
                    </button>
                  </div>

                  {errors.questions && <p className="mb-3 text-xs text-red-400">{errors.questions}</p>}

                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-medium text-white">Question {index + 1}</span>
                          <button
                            onClick={() => removeQuestion(question.id)}
                            className="rounded-lg p-1 text-red-400 transition-colors hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <select
                            value={question.type}
                            onChange={(e) =>
                              updateQuestion(question.id, { type: e.target.value as QuestionType })
                            }
                            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white focus:border-blue-500/50 focus:outline-none"
                          >
                            <option value="Multiple Choice">Multiple Choice</option>
                            <option value="True/False">True/False</option>
                            <option value="Open-Ended">Open-Ended</option>
                          </select>

                          <input
                            type="text"
                            value={question.question}
                            onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none"
                            placeholder="Enter your question..."
                          />

                          {question.type === 'Multiple Choice' && (
                            <div className="space-y-2">
                              {question.options?.map((option, optIndex) => (
                                <input
                                  key={optIndex}
                                  type="text"
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...(question.options || [])];
                                    newOptions[optIndex] = e.target.value;
                                    updateQuestion(question.id, { options: newOptions });
                                  }}
                                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none"
                                  placeholder={`Option ${optIndex + 1}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {questions.length === 0 && (
                      <div className="rounded-lg border border-dashed border-white/[0.08] bg-white/[0.02] p-8 text-center">
                        <ClipboardList className="mx-auto mb-2 h-8 w-8 text-white/20" />
                        <p className="text-sm text-white/40">No questions added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {isSubmitting && uploadProgress > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-white/70">Uploading...</span>
                    <span className="font-medium text-blue-400">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between border-t border-white/[0.08] bg-gray-900/95 p-6 backdrop-blur-xl">
          <button
            onClick={step === 1 ? onCancel : () => setStep(1)}
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/[0.14] hover:bg-white/[0.07]"
            disabled={isSubmitting}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step === 1 ? (
            <button
              onClick={nextStep}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-purple-600"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Resource'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceUploadForm;
