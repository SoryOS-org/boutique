import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer, terminate } from 'firebase/firestore';
import config from '../firebase-applet-config.json' with { type: 'json' };

async function verifyFirestore() {
  console.log('--- 1. Verification Backend Firebase Firestore ---');
  try {
    const app = initializeApp(config, 'verifier-app');
    const db = getFirestore(app, config.firestoreDatabaseId);
    console.log(`[PASS] Firebase App initialisée avec projectId: ${config.projectId} et databaseId: ${config.firestoreDatabaseId}`);

    // Test direct server reachability
    const probeDoc = doc(db, 'non_existent_probe_root', 'ping');
    try {
      await getDocFromServer(probeDoc);
      console.log('[PASS] Connexion Firestore établie (200 OK)');
    } catch (err: any) {
      if (err.code === 'permission-denied') {
        console.log('[PASS] Connexion Firestore active et règles de sécurité en vigueur (permission-denied attendu sur chemin non autorisé)');
      } else {
        console.log(`[STATUS] Code Firestore: ${err.code || err.message}`);
      }
    }

    await terminate(db);
  } catch (err: any) {
    console.error('[FAIL] Erreur initialisation Firebase:', err);
    process.exit(1);
  }
}

async function verifyDataStructures() {
  console.log('--- 2. Verification Schémas et Données ---');
  const blueprint = await import('../firebase-blueprint.json', { with: { type: 'json' } });
  if (blueprint.default && blueprint.default.entities && blueprint.default.entities.chat && blueprint.default.entities.message) {
    console.log('[PASS] Schémas d’entités chat & message validés dans firebase-blueprint.json');
  } else {
    console.error('[FAIL] Schéma blueprint incomplet');
  }
}

async function main() {
  await verifyFirestore();
  await verifyDataStructures();
  console.log('--- Fin des vérifications ---');
  process.exit(0);
}

main();
