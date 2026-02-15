import { DemandeRV } from '../entities/DemandeRV';
import { DemandeRVRepository } from '../repositories/DemandeRVRepository';
import { PatientRepository } from '../repositories/PatientRepository';
import { Specialite } from '../entities/Specialite';
import { StatutDemande } from '../enums/StatutDemande';
import { StatutRV } from '../enums/StatutRV';
import { AppError } from '../middlewares/errorHandler';
import { AppDataSource } from '../config/database';

export class DemandeRVService {
  private demandeRVRepository: DemandeRVRepository;
  private patientRepository: PatientRepository;

  constructor() {
    this.demandeRVRepository = new DemandeRVRepository();
    this.patientRepository = new PatientRepository();
  }

  async getAllDemandes(): Promise<DemandeRV[]> {
    return this.demandeRVRepository.findAll();
  }

  async getDemandeById(id: string): Promise<DemandeRV> {
    const demande = await this.demandeRVRepository.findById(id);
    if (!demande) {
      throw new AppError('Demande de rendez-vous non trouvée', 404);
    }
    return demande;
  }

  async createDemande(data: {
    patientId: string;
    date: Date;
    heure: string;
    specialiteId: string;
    commentaire?: string;
  }): Promise<DemandeRV> {
    // Vérifier si le patient existe
    const patient = await this.patientRepository.findById(data.patientId);
    if (!patient) {
      throw new AppError('Patient non trouvé', 404);
    }

    // Vérifier si la spécialité existe
    const specialiteRepository = AppDataSource.getRepository(Specialite);
    const specialite = await specialiteRepository.findOneBy({ id: data.specialiteId });
    if (!specialite) {
      throw new AppError('Spécialité non trouvée', 404);
    }

    // Générer un numéro unique pour la demande
    const numero = `DEM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Créer la demande
    return this.demandeRVRepository.create({
      numero,
      date: data.date,
      heure: data.heure,
      patient: patient,
      specialite: specialite,
      statutDemande: StatutDemande.EN_ATTENTE,
      statutRV: StatutRV.EN_COURS,
    });
  }

  async getDemandesByPatientId(patientId: string): Promise<DemandeRV[]> {
    return this.demandeRVRepository.findByPatientId(patientId);
  }

  async getDemandesByStatut(statut: StatutDemande): Promise<DemandeRV[]> {
    return this.demandeRVRepository.findByStatut(statut);
  }

  async getDemandesByPatientIdAndStatut(
    patientId: string,
    statut: StatutDemande | StatutRV
  ): Promise<DemandeRV[]> {
    return this.demandeRVRepository.findByPatientIdAndStatut(patientId, statut);
  }

  async updateDemande(
    id: string,
    data: Partial<{
      date: Date;
      heure: string;
      specialiteId: string;
      statutDemande: StatutDemande;
      statutRV: StatutRV;
      commentaire: string;
    }>
  ): Promise<DemandeRV> {
    await this.getDemandeById(id);
    
    const updateData: any = { ...data };
    
    // Si une nouvelle spécialité est fournie, la charger
    if (data.specialiteId) {
      const specialiteRepository = AppDataSource.getRepository(Specialite);
      const specialite = await specialiteRepository.findOneBy({ id: data.specialiteId });
      if (!specialite) {
        throw new AppError('Spécialité non trouvée', 404);
      }
      updateData.specialite = specialite;
      delete updateData.specialiteId;
    }
    
    return this.demandeRVRepository.update(id, updateData);
  }

  async deleteDemande(id: string): Promise<void> {
    await this.getDemandeById(id);
    await this.demandeRVRepository.delete(id);
  }

  async cancelDemande(id: string): Promise<DemandeRV> {
    const demande = await this.getDemandeById(id);
    
    if (demande.statutDemande === StatutDemande.VALIDE) {
      throw new AppError('Impossible d\'annuler un rendez-vous validé', 400);
    }

    return this.updateDemande(id, { 
      statutDemande: StatutDemande.REFUSE,
      statutRV: StatutRV.ANNULER
    });
  }

  async getConfirmedRV(patientId: string): Promise<DemandeRV[]> {
    return this.demandeRVRepository.findByPatientIdAndStatut(
      patientId,
      StatutDemande.VALIDE
    );
  }
}