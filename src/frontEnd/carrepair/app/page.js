"use client";

import { Box, Container, Grid, Typography, Button, Stack } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>

      {/* OFFSET PGA FIXED NAVBAR */}
      <Box sx={{ height: { xs: 70, md: 80 } }} />

      {/* HERO */}
      <Container maxWidth="lg">
        <Grid
          container
          spacing={6}
          sx={{ py: { xs: 6, md: 10 }, alignItems: "center" }}
        >

          {/* TEKST */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                mb: 3,
                color: "#1e293b"
              }}
            >
              BilHistorik samlet ét sted
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, fontSize: "1.1rem" }}>
              Få fuldt overblik over reparationer, service, syn og ejerskifte.
              Perfekt til både private, virksomheder og værksteder.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "primary.main",
                  "&:hover": { backgroundColor: "#3b82f6" },
                }}
              >
                Kom i gang
              </Button>

              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "#5e2b97",
                    backgroundColor: "rgba(94,43,151,0.05)",
                  },
                }}
              >
                Læs mere
              </Button>
            </Stack>
          </Grid>

          {/* LOGO */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: "center" }}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 500,
                mx: "auto",
              }}
            >
              <img
                src="/logo.png"
                alt="BilHistorik logo"
                width={500}
                height={500}
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* FEATURES */}
      <Box sx={{ bgcolor: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                Reparationer & Service
              </Typography>
              <Typography color="text.secondary">
                Registrer og se hele bilens historik ét sted.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                Syn & Historik
              </Typography>
              <Typography color="text.secondary">
                Hold styr på syn og tidligere data på bilen.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                Værksted & Kvitteringer
              </Typography>
              <Typography color="text.secondary">
                Lav og gem regninger og kvitteringer nemt.
              </Typography>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} BilHistorik
        </Typography>
      </Box>
    </Box>
  );
}