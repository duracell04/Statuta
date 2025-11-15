export type Clause = {
  id: string;
  article_no: string;
  heading: string;
  text: string;
  tags: string[];
};

export type Revision = {
  rev_id: string;
  parent_rev?: string;
  created_at: string;
  label: string;
  rationale: string;
  signer_ids: string[];
  status: "draft" | "proposal" | "approved" | "released";
  effective_from?: string;
  documents?: {
    board_minutes?: string;
    supporting_memo?: string;
  };
};

export type SignatureAttestation = {
  rev_id: string;
  type: "QES" | "sigstore";
  signer: string;
  time: string;
  evidence_uri: string;
};

export type Statute = {
  clauses: Clause[];
};
