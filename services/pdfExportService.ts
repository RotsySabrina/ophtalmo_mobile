import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

interface ConsultationData {
  id: number;
  date_consultation: string;
  motif: string;
  acuite_visuelle_od?: string;
  acuite_visuelle_og?: string;
  tonometrie_od?: string;
  tonometrie_og?: string;
  refraction_od?: string;
  refraction_og?: string;
  diagnostic?: string;
  traitement_propose?: string;
  observations?: string;
  prochaine_visite?: string;
  medecin_nom?: string;
  medecin_prenom?: string;
  specialite?: string;
  prescriptions?: any[];
}

interface DossierData {
  id: number;
  date_creation: string;
  antecedents_ophthalmologiques?: string;
  antecedents_medicaux?: string;
  allergies?: string;
  traitements_actuels?: string;
  remarques?: string;
  patient_nom?: string;
  patient_prenom?: string;
}

export class PDFExportService {
  static async generateConsultationPDF(consultation: ConsultationData) {
    try {
      const html = this.generateConsultationHTML(consultation);
      
      const { uri } = await Print.printToFileAsync({ html });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: `Export Consultation ${consultation.date_consultation}`,
          UTI: '.pdf',
          mimeType: 'application/pdf'
        });
      } else {
        Alert.alert('Partage non disponible', 'La fonction de partage n\'est pas disponible sur cet appareil.');
      }
      
      return uri;
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      Alert.alert('Erreur', 'Impossible de générer le PDF');
      throw error;
    }
  }

  static async generateDossierPDF(dossier: DossierData, consultations: ConsultationData[]) {
    try {
      const html = this.generateDossierHTML(dossier, consultations);
      
      const { uri } = await Print.printToFileAsync({ html });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: `Export Dossier Médical ${dossier.patient_nom}`,
          UTI: '.pdf',
          mimeType: 'application/pdf'
        });
      } else {
        Alert.alert('Partage non disponible', 'La fonction de partage n\'est pas disponible sur cet appareil.');
      }
      
      return uri;
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      Alert.alert('Erreur', 'Impossible de générer le PDF');
      throw error;
    }
  }

  private static generateConsultationHTML(consultation: ConsultationData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Consultation ${consultation.date_consultation}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007AFF; padding-bottom: 20px; }
          .title { color: #007AFF; font-size: 24px; margin-bottom: 10px; }
          .subtitle { color: #666; font-size: 16px; }
          .section { margin-bottom: 25px; }
          .section-title { color: #2c3e50; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
          .grid-item { background: #f8f9fa; padding: 15px; border-radius: 8px; }
          .label { font-size: 12px; color: #7f8c8d; margin-bottom: 5px; }
          .value { font-size: 16px; font-weight: bold; color: #2c3e50; }
          .info-item { margin-bottom: 12px; }
          .info-label { font-weight: bold; color: #34495e; margin-bottom: 4px; }
          .info-text { color: #2c3e50; line-height: 1.5; }
          .prescription { background: #e8f5e8; padding: 12px; border-radius: 6px; margin-bottom: 10px; }
          .footer { margin-top: 40px; text-align: center; color: #7f8c8d; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
          .signature { margin-top: 60px; border-top: 1px solid #000; width: 300px; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">Cabinet d'Ophtalmologie</h1>
          <p class="subtitle">Compte-rendu de Consultation</p>
        </div>

        <div class="section">
          <div class="section-title">Informations de la Consultation</div>
          <div class="info-item">
            <span class="info-label">Date:</span>
            <span class="info-text">${new Date(consultation.date_consultation).toLocaleDateString('fr-FR')}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Motif:</span>
            <span class="info-text">${consultation.motif}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Médecin:</span>
            <span class="info-text">Dr. ${consultation.medecin_prenom} ${consultation.medecin_nom}${consultation.specialite ? ` - ${consultation.specialite}` : ''}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Examens Ophtalmologiques</div>
          <div class="grid">
            <div class="grid-item">
              <div class="label">Acuité Visuelle OD</div>
              <div class="value">${consultation.acuite_visuelle_od || 'N/A'}</div>
            </div>
            <div class="grid-item">
              <div class="label">Acuité Visuelle OG</div>
              <div class="value">${consultation.acuite_visuelle_og || 'N/A'}</div>
            </div>
            <div class="grid-item">
              <div class="label">Pression OD</div>
              <div class="value">${consultation.tonometrie_od || 'N/A'}</div>
            </div>
            <div class="grid-item">
              <div class="label">Pression OG</div>
              <div class="value">${consultation.tonometrie_og || 'N/A'}</div>
            </div>
          </div>

          ${consultation.refraction_od ? `
            <div class="info-item">
              <div class="info-label">Correction OD:</div>
              <div class="info-text">${consultation.refraction_od}</div>
            </div>
          ` : ''}

          ${consultation.refraction_og ? `
            <div class="info-item">
              <div class="info-label">Correction OG:</div>
              <div class="info-text">${consultation.refraction_og}</div>
            </div>
          ` : ''}
        </div>

        ${consultation.diagnostic ? `
          <div class="section">
            <div class="section-title">Diagnostic</div>
            <div class="info-text">${consultation.diagnostic}</div>
          </div>
        ` : ''}

        ${consultation.traitement_propose ? `
          <div class="section">
            <div class="section-title">Traitement Proposé</div>
            <div class="info-text">${consultation.traitement_propose}</div>
          </div>
        ` : ''}

        ${consultation.prescriptions && consultation.prescriptions.length > 0 ? `
          <div class="section">
            <div class="section-title">Prescriptions</div>
            ${consultation.prescriptions.map(prescription => `
              <div class="prescription">
                <div class="info-label">${prescription.type} ${prescription.oeil ? `- ${prescription.oeil}` : ''}</div>
                <div class="info-text">${prescription.details}</div>
                ${prescription.posologie ? `<div class="info-text"><small>Posologie: ${prescription.posologie}</small></div>` : ''}
                ${prescription.duree ? `<div class="info-text"><small>Durée: ${prescription.duree}</small></div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${consultation.observations ? `
          <div class="section">
            <div class="section-title">Observations</div>
            <div class="info-text">${consultation.observations}</div>
          </div>
        ` : ''}

        ${consultation.prochaine_visite ? `
          <div class="section">
            <div class="section-title">Prochaine Visite</div>
            <div class="info-text">${new Date(consultation.prochaine_visite).toLocaleDateString('fr-FR')}</div>
          </div>
        ` : ''}

        <div class="footer">
          <p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p>
          <div class="signature">
            <p>Signature et cachet du médecin</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private static generateDossierHTML(dossier: DossierData, consultations: ConsultationData[]): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Dossier Médical ${dossier.patient_nom}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007AFF; padding-bottom: 20px; }
          .title { color: #007AFF; font-size: 24px; margin-bottom: 10px; }
          .patient-info { margin-bottom: 30px; }
          .section { margin-bottom: 25px; }
          .section-title { color: #2c3e50; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .info-item { margin-bottom: 12px; }
          .info-label { font-weight: bold; color: #34495e; margin-bottom: 4px; }
          .info-text { color: #2c3e50; line-height: 1.5; }
          .consultation { border: 1px solid #eee; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
          .consultation-date { font-weight: bold; color: #007AFF; }
          .footer { margin-top: 40px; text-align: center; color: #7f8c8d; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">Dossier Médical Ophtalmologique</h1>
        </div>

        <div class="patient-info">
          <div class="section-title">Informations Patient</div>
          <div class="info-item">
            <span class="info-label">Patient:</span>
            <span class="info-text">${dossier.patient_prenom} ${dossier.patient_nom}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Dossier créé le:</span>
            <span class="info-text">${new Date(dossier.date_creation).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        ${dossier.antecedents_medicaux ? `
          <div class="section">
            <div class="section-title">Antécédents Médicaux</div>
            <div class="info-text">${dossier.antecedents_medicaux}</div>
          </div>
        ` : ''}

        ${dossier.antecedents_ophthalmologiques ? `
          <div class="section">
            <div class="section-title">Antécédents Ophtalmologiques</div>
            <div class="info-text">${dossier.antecedents_ophthalmologiques}</div>
          </div>
        ` : ''}

        ${dossier.allergies ? `
          <div class="section">
            <div class="section-title">Allergies</div>
            <div class="info-text">${dossier.allergies}</div>
          </div>
        ` : ''}

        ${dossier.traitements_actuels ? `
          <div class="section">
            <div class="section-title">Traitements Actuels</div>
            <div class="info-text">${dossier.traitements_actuels}</div>
          </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Historique des Consultations (${consultations.length})</div>
          ${consultations.length > 0 ? consultations.map(consultation => `
            <div class="consultation">
              <div class="consultation-date">
                ${new Date(consultation.date_consultation).toLocaleDateString('fr-FR')} - ${consultation.motif}
              </div>
              <div class="info-text">
                Médecin: Dr. ${consultation.medecin_prenom} ${consultation.medecin_nom}
                ${consultation.diagnostic ? `<br>Diagnostic: ${consultation.diagnostic}` : ''}
              </div>
            </div>
          `).join('') : '<div class="info-text">Aucune consultation</div>'}
        </div>

        <div class="footer">
          <p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p>
          <p>Cabinet d'Ophtalmologie - Tous droits réservés</p>
        </div>
      </body>
      </html>
    `;
  }
}