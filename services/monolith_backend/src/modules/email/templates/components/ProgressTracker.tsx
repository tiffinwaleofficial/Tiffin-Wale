import React from 'react';
import { Text } from '@react-email/components';
import { CheckCircleIcon, ClockIcon } from './Icons';

interface Step {
  label: string;
  description?: string;
  completed: boolean;
}

interface ProgressTrackerProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <tr key={index}>
            <td style={{ paddingBottom: index === steps.length - 1 ? 0 : '24px' }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  {/* Icon/Number Circle */}
                  <td width="50" style={{ verticalAlign: 'top', paddingRight: '16px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: isCompleted 
                        ? 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)'
                        : isCurrent
                        ? 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)'
                        : '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}>
                      {isCompleted ? (
                        <CheckCircleIcon size={24} color="#ffffff" />
                      ) : (
                        <Text style={{
                          color: isCurrent ? '#ffffff' : '#9ca3af',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          margin: 0,
                          lineHeight: '1',
                        }}>
                          {index + 1}
                        </Text>
                      )}
                    </div>
                  </td>

                  {/* Step Details */}
                  <td style={{ verticalAlign: 'top' }}>
                    <Text style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: isCompleted || isCurrent ? '#1f2937' : '#9ca3af',
                      margin: '0 0 4px 0',
                      lineHeight: '1.4',
                    }}>
                      {step.label}
                      {isCurrent && ' 🔥'}
                    </Text>
                    {step.description && (
                      <Text style={{
                        fontSize: '14px',
                        color: isCompleted || isCurrent ? '#6b7280' : '#9ca3af',
                        margin: 0,
                        lineHeight: '1.5',
                      }}>
                        {step.description}
                      </Text>
                    )}
                  </td>
                </tr>
              </table>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div style={{
                  width: '2px',
                  height: '24px',
                  backgroundColor: isCompleted ? '#22c55e' : '#e5e7eb',
                  marginLeft: '21px',
                  marginTop: '8px',
                  marginBottom: '0',
                }}></div>
              )}
            </td>
          </tr>
        );
      })}
    </table>
  );
};

export default ProgressTracker;

