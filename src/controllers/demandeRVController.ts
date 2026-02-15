import { Request, Response, NextFunction } from 'express';
import { DemandeRVService } from '../services/demandeRVService';
import { StatutDemande } from '../enums/StatutDemande';
import { StatutRV } from '../enums/StatutRV';
import { AppError } from '../middlewares/errorHandler';
import { AppDataSource } from '../config/database';
import { Specialite } from '../entities/Specialite';

export class DemandeRVController {
  private demandeRVService: DemandeRVService;

  constructor() {
    this.demandeRVService = new DemandeRVService();
  }

  // GET /api/demandes
  async getAllDemandes(req: Request, res: Response, next: NextFunction) {
    try {
      const demandes = await this.demandeRVService.getAllDemandes();
      res.status(200).json({
        status: 'OK',
        success: true,
        count: demandes.length,
        data: demandes,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/demandes/:id
  async getDemandeById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const demandeId = Array.isArray(id) ? id[0] : id;
      const demande = await this.demandeRVService.getDemandeById(demandeId);
      res.status(200).json({
        success: true,
        data: demande,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/demandes
  async createDemande(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, heure, specialiteId, commentaire } = req.body;
      const patientId = req.body.patientId; // Ajouté par le middleware d'authentification

      // Validation
      if (!date || !heure || !specialiteId) {
        throw new AppError('Tous les champs obligatoires doivent être remplis', 400);
      }

      // Vérifier si la spécialité existe
      const specialiteRepository = AppDataSource.getRepository(Specialite);
      const specialite = await specialiteRepository.findOneBy({ id: specialiteId });
      if (!specialite) {
        throw new AppError('Spécialité non trouvée', 404);
      }

      const demande = await this.demandeRVService.createDemande({
        patientId,
        date: new Date(date),
        heure,
        specialiteId,
        commentaire,
      });

      res.status(201).json({
        success: true,
        data: demande,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/demandes/mine
   async getMyDemandes(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.body.patientId;
      const demandes = await this.demandeRVService.getDemandesByPatientId(patientId);
      res.status(200).json({
        success: true,
        count: demandes.length,
        data: demandes,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/demandes/mine/filter
  async getMyDemandesByStatut(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.body.patientId;
      const { statut } = req.query;

      // Vérifier si le statut est valide
      if (!statut) {
        throw new AppError('Le paramètre statut est requis', 400);
      }

      const isStatutDemande = Object.values(StatutDemande).includes(statut as StatutDemande);
      const isStatutRV = Object.values(StatutRV).includes(statut as StatutRV);

      if (!isStatutDemande && !isStatutRV) {
        throw new AppError('Statut invalide', 400);
      }

      const demandes = await this.demandeRVService.getDemandesByPatientIdAndStatut(
        patientId,
        statut as StatutRV | StatutDemande
      );

      res.status(200).json({
        success: true,
        count: demandes.length,
        data: demandes,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/demandes/:id
  async updateDemande(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const demandeId = Array.isArray(id) ? id[0] : id;
      const { date, heure, specialiteId, statutDemande, statutRV, commentaire } = req.body;

      const demande = await this.demandeRVService.updateDemande(demandeId, {
        date: date ? new Date(date) : undefined,
        heure,
        specialiteId,
        statutDemande,
        statutRV,
        commentaire,
      });

      res.status(200).json({
        success: true,
        data: demande,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/demandes/:id
  async deleteDemande(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const demandeId = Array.isArray(id) ? id[0] : id;
      await this.demandeRVService.deleteDemande(demandeId);
      res.status(204).json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/demandes/:id/cancel
  async cancelDemande(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const demandeId = Array.isArray(id) ? id[0] : id;
      const demande = await this.demandeRVService.cancelDemande(demandeId);
      res.status(200).json({
        success: true,
        data: demande,
      });
    } catch (error) {
      next(error);
    }
  }

   // méthode pour "Voir ses RV" (demandes avec statut "Valider")
  async getMyConfirmedRV(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.body.patientId;
      const demandes = await this.demandeRVService.getConfirmedRV(patientId);
      res.status(200).json({
        success: true,
        count: demandes.length,
        data: demandes,
      });
    } catch (error) {
      next(error);
    }
  }
}