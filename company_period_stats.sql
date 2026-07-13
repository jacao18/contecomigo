-- ══════════════════════════════════════════════════════════════════
--  ConteComigo — RPC company_period_stats com granularidade dinâmica
--  Retorna festas/convidados agrupados por dia, semana ou mês.
--  Execute INTEIRO no Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.company_period_stats(
  p_company_id  uuid,
  p_months      int  DEFAULT 3,
  p_granularity text DEFAULT 'month'  -- 'day' | 'week' | 'month'
)
RETURNS TABLE(
  bucket_start timestamptz,
  label        text,
  festas       bigint,
  convidados   bigint
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_trunc text;
  v_fmt   text;
BEGIN
  -- Só o dono da empresa pode ler estatísticas
  IF NOT EXISTS (
    SELECT 1 FROM public.companies c
    WHERE c.id = p_company_id AND c.owner_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Acesso negado.';
  END IF;

  IF p_granularity = 'day' THEN
    v_trunc := 'day';
    v_fmt   := 'DD/MM';
  ELSIF p_granularity = 'week' THEN
    v_trunc := 'week';
    v_fmt   := 'DD/MM';
  ELSE
    v_trunc := 'month';
    v_fmt   := 'Mon/YY';
  END IF;

  RETURN QUERY EXECUTE format($q$
    SELECT
      DATE_TRUNC(%L, i.created_at)            AS bucket_start,
      TO_CHAR(DATE_TRUNC(%L, i.created_at), %L) AS label,
      COUNT(DISTINCT i.id)                     AS festas,
      COUNT(g.id)                              AS convidados
    FROM public.invites i
    JOIN public.profiles p
      ON p.id = i.user_id AND p.company_id = %L
    LEFT JOIN public.guests g ON g.invite_id = i.id
    WHERE i.created_at >= NOW() - (%L || ' months')::interval
    GROUP BY DATE_TRUNC(%L, i.created_at)
    ORDER BY DATE_TRUNC(%L, i.created_at)
  $q$, v_trunc, v_trunc, v_fmt, p_company_id, p_months, v_trunc, v_trunc);
END;
$$;

GRANT EXECUTE ON FUNCTION public.company_period_stats(uuid, int, text) TO authenticated;
