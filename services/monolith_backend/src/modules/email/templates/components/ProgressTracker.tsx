import React from 'react';
import { Section, Text } from '@react-email/components';
import { CheckCircleIcon } from './Icons';

interface Step {
  label: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

interface ProgressTrackerProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps, currentStep }) => {
  return (
    <Section style={{ marginBottom: '32px' }}>
      <Text style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: '0 0 24px 0',
        textAlign: 'center',
      }}>
        Order Progress
      </Text>
      <table width="100%" cellPadding="0" cellSpacing="0">
        {steps.map((step, index) => (
          <tr key={index}>
            <td style={{ paddingBottom: index === steps.length - 1 ? 0 : '24px' }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td width="40" style={{ verticalAlign: 'top', paddingRight: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: step.completed ? '#10b981' : (step.current ? '#f97316' : '#e5e7eb'),
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}>
                      {step.completed ? <CheckCircleIcon size={20} color="#ffffff"/> : index + 1}
                    </div>
                  </td>
                  <td>
                    <Text style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: step.completed || step.current ? '#1f2937' : '#9ca3af',
                      margin: '0 0 4px 0',
                    }}>
                      {step.label}
                    </Text>
                    <Text style={{
                      fontSize: '14px',
                      color: step.completed || step.current ? '#6b7280' : '#d1d5db',
                      margin: 0,
                      lineHeight: '1.5',
                    }}>
                      {step.description}
                    </Text>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        ))}
      </table>
    </Section>
  );
};

export default ProgressTracker;
