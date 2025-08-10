'use client';

import { useState, useEffect } from 'react';
import { useForm, useStore } from '@tanstack/react-form';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import {
  RenderComboBoxField,
  RenderInputField,
  RenderSelectField,
} from './forms/FormComponents';
import Spinner from './common/Spinner';
import {
  DIETARY_RESTRICTIONS,
  FACULTIES,
  Faculty,
  getMajorsForFaculty,
  INTEREST_OPTIONS,
  YEAR_OPTIONS,
} from '@/lib/constants';
import {
  GraduationCap,
  PartyPopper,
  Shapes,
  SmileIcon,
  UserRoundPen,
  Vegan,
} from 'lucide-react';
import { fetchFromAPI } from '@/lib/httpHandlers';
import { UserProfileData } from '@/lib/types';
import { Select } from './ui/select';

const steps = [
  {
    title: 'Welcome to the portal!',
    description: `Let's get to know you a little better.`,
    icon: SmileIcon,
  },
  {
    title: 'Student Profile',
    description: `Your personal profile and background.`,
    icon: GraduationCap,
  },
  {
    title: 'Profile Picture',
    description: `Upload a photo of yourself!`,
    icon: UserRoundPen,
  },
  {
    title: 'Dietary Restrictions',
    description: `What food are you able to eat?`,
    icon: Vegan,
  },
  {
    title: 'Your Interests',
    description: `Let us know what fields you're interested in! This will help us plan future events for you.`,
    icon: Shapes,
  },
  {
    title: 'Congrats!',
    description: 'Welcome to the MA portal',
    icon: PartyPopper,
  },
];

export default function OnboardingModal() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  const { width, height } = useWindowSize();

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetchFromAPI('/api/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = (await res.json()) as UserProfileData;

      if (!data.onboardingComplete) {
        setOpen(true);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (step === steps.length - 1) {
      setShowConfetti(true);
    }
  }, [step]);

  const form = useForm({
    defaultValues: {
      year: '',
      major: '',
      faculty: '',
      linkedinUrl: '',
      avatar: '',
      interests: [] as string[],
      diet: [] as string[],
      onboardingComplete: true,
    },
    onSubmit: async ({ value }) => {
      await fetchFromAPI('/api/me/', {
        method: 'POST',
        body: value,
      });
      setStep((s) => s + 1);
    },
  });

  const selectedFaculty = useStore(
    form.store,
    (state) => state.values.faculty
  ) as Faculty;
  const majors = selectedFaculty ? getMajorsForFaculty(selectedFaculty) : [];

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={600}
            gravity={1}
            initialVelocityY={15}
          />
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay className="backdrop-blur-xs" />
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{`${steps[step]?.title} ${step > 0 && step < 5 ? `(${step}/${steps.length - 2})` : ''}`}</DialogTitle>
          </DialogHeader>
          {step > 0 && step < 4 && (
            <div className="flex justify-between mb-6">
              {steps.map((label, index) => (
                <div
                  key={index}
                  className={`flex-1 h-2 mx-1 rounded-full ${index + 1 <= step ? 'bg-primary' : 'bg-muted'}`}
                />
              ))}
            </div>
          )}

          <motion.form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-6 relative h-fit"
          >
            <AnimatePresence mode="wait">
              <motion.div key="step-indicator">
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 w-full"
                  >
                    <p className="text-muted-foreground">
                      {steps[step].description}
                    </p>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 w-full"
                  >
                    <div className="flex gap-4 w-full">
                      <div className="flex-[0_0_10%]">
                        <form.Field
                          name="year"
                          validators={{
                            onChange: ({ value }) =>
                              !value ? 'Year is required.' : undefined,
                          }}
                          children={(field) => (
                            <RenderSelectField
                              options={YEAR_OPTIONS}
                              label="Year"
                              field={field}
                              placeholder=" "
                            />
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <form.Field
                          name="faculty"
                          validators={{
                            onChange: ({ value }) =>
                              !value ? 'Faculty is required.' : undefined,
                          }}
                          children={(field) => (
                            <RenderSelectField
                              options={FACULTIES}
                              label="Faculty"
                              field={field}
                            />
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <form.Field
                          name="major"
                          validators={{
                            onChange: ({ value }) =>
                              !value ? 'Major is required.' : undefined,
                          }}
                          children={(field) => {
                            return (
                              <RenderComboBoxField
                                options={majors}
                                label="Major"
                                field={field}
                              />
                            );
                          }}
                        />
                      </div>
                    </div>
                    <form.Field
                      name="linkedinUrl"
                      children={(field) => (
                        <RenderInputField label="LinkedIn URL" field={field} />
                      )}
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 w-full"
                  >
                    <form.Field
                      name="avatar"
                      children={(field) => (
                        <RenderInputField
                          type="file"
                          label="Upload a Profile Picture!"
                          field={field}
                        />
                      )}
                    />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 w-full"
                  >
                    <form.Field
                      name="diet"
                      children={(field) => {
                        const handleAddAllergy = (
                          e: React.KeyboardEvent<HTMLInputElement>
                        ) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = (
                              e.target as HTMLInputElement
                            ).value.trim();
                            if (value && !field.state.value.includes(value)) {
                              field.handleChange([...field.state.value, value]);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        };

                        const handleRemoveAllergy = (allergy: string) => {
                          const updated = field.state.value.filter(
                            (i: string) => i !== allergy
                          );
                          field.handleChange(updated);
                        };

                        return (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                              {DIETARY_RESTRICTIONS.map((restriction) => (
                                <label
                                  key={restriction}
                                  className="flex items-center gap-2"
                                >
                                  <Checkbox
                                    checked={field.state.value.includes(
                                      restriction
                                    )}
                                    onCheckedChange={(checked) => {
                                      const newInterests = checked
                                        ? [...field.state.value, restriction]
                                        : field.state.value.filter(
                                            (i: string) => i !== restriction
                                          );
                                      field.handleChange(newInterests);
                                    }}
                                  />
                                  {restriction}
                                </label>
                              ))}
                            </div>

                            {/* Dynamic allergy input */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium">
                                Other Allergies
                              </label>
                              <input
                                type="text"
                                onKeyDown={handleAddAllergy}
                                placeholder="Type and press Enter..."
                                className="border rounded px-3 py-2 w-full"
                              />
                              {/* Show all selected allergies */}
                              <div className="flex flex-wrap gap-2 mt-2">
                                {field.state.value
                                  .filter(
                                    (item: string) =>
                                      !DIETARY_RESTRICTIONS.includes(item)
                                  )
                                  .map((allergy: string) => (
                                    <div
                                      key={allergy}
                                      className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm"
                                    >
                                      {allergy}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveAllergy(allergy)
                                        }
                                        className="text-red-500 ml-1"
                                      >
                                        &times;
                                      </button>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 w-full"
                  >
                    <form.Field
                      name="interests"
                      children={(field) => (
                        <div className="grid grid-cols-2 gap-2">
                          {INTEREST_OPTIONS.map((interest) => (
                            <label
                              key={interest}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                checked={field.state.value.includes(interest)}
                                onCheckedChange={(checked) => {
                                  const newInterests = checked
                                    ? [...field.state.value, interest]
                                    : field.state.value.filter(
                                        (i) => i !== interest
                                      );
                                  field.handleChange(newInterests);
                                }}
                              />
                              {interest}
                            </label>
                          ))}
                        </div>
                      )}
                    />
                    <form.Subscribe
                      selector={(state) => [
                        state.canSubmit,
                        state.isSubmitting,
                      ]}
                      children={([canSubmit, isSubmitting]) => (
                        <div className="flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep((s) => s - 1)}
                          >
                            Back
                          </Button>

                          <Button
                            className="cursor-pointer font-regular bg-ma-red"
                            variant="ma"
                            type="submit"
                            disabled={!canSubmit}
                          >
                            {isSubmitting ? (
                              <>
                                <Spinner />
                                <div>Loading</div>
                              </>
                            ) : (
                              <div>Complete Profile</div>
                            )}
                          </Button>
                        </div>
                      )}
                    />
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="text-center space-y-6 w-full"
                  >
                    <p className="text-muted-foreground">{"You're all set!"}</p>
                    <Button onClick={() => setOpen(false)}>Go to Home</Button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between">
              {step > 0 && step < steps.length - 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </Button>
              )}
              {step < steps.length - 2 && (
                <Button type="button" onClick={() => setStep((s) => s + 1)}>
                  Next
                </Button>
              )}
            </div>
          </motion.form>
        </DialogContent>
      </Dialog>
    </>
  );
}
