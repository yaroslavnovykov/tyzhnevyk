import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAppointmentStore } from '@/store/appointments';
import { api } from '@/services/api';
import type { Service } from '@/types';

export const ServicesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedService } = useAppointmentStore();
  const [services, setServices] = React.useState<Service[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (err) {
        setError('Не вдалося завантажити послуги');
        console.error('Failed to fetch services:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    navigate(`/calendar/${service.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background p-4">
        <div className="max-w-md mx-auto text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Спробувати знову
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/appointments')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Оберіть послугу</h1>
        </div>

        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-card p-4 rounded-lg shadow-sm border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => handleServiceSelect(service)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {service.description}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {service.duration} хв
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(service.price)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};