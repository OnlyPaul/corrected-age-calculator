import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoIcon from '@mui/icons-material/Info'
import SecurityIcon from '@mui/icons-material/Security'

export default function InfoPanel() {
  return (
    <Paper sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <InfoIcon color="primary" />
        <Typography variant="h5" component="h2">
          Clinical Information & Guidelines
        </Typography>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="definitions-content"
          id="definitions-header"
        >
          <Typography variant="h6">Age Definitions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText
                primary="Postnatal Age (PNA)"
                secondary="The actual time that has elapsed since birth, regardless of gestational age at birth."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Postmenstrual Age (PMA)"
                secondary="Gestational age at birth plus postnatal age. Represents the total age from conception, commonly used in neonatal care for medication dosing and developmental assessments."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Corrected Age (Adjusted Age)"
                secondary="Chronological age adjusted for prematurity. Calculated by subtracting the number of weeks/days an infant was born early from their chronological age."
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="guidelines-content"
          id="guidelines-header"
        >
          <Typography variant="h6">Clinical Guidelines</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            <strong>When to Use Corrected Age:</strong>
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Premature Infants (< 37 weeks GA)"
                secondary="Corrected age should be used for developmental assessments, growth charts, and milestone tracking."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Duration of Use"
                secondary="Typically recommended until 24 months of age, though some guidelines suggest until 36 months for extremely premature infants."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Term Reference"
                secondary="40 weeks gestational age is used as the term reference point for correction calculations."
              />
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            <strong>Important Considerations:</strong>
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Immunizations"
                secondary="Follow chronological age (postnatal age) for vaccination schedules, not corrected age."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Medical Assessments"
                secondary="Some assessments may require chronological age while others use corrected age. Consult specific guidelines."
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="references-content"
          id="references-header"
        >
          <Typography variant="h6">References & Resources</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText
                primary="American Academy of Pediatrics (AAP)"
                secondary={
                  <>
                    Guidelines on the use of corrected age for premature infants. 
                    <Link 
                      href="https://www.aap.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ ml: 1 }}
                    >
                      Learn more
                    </Link>
                  </>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="CDC Growth Charts"
                secondary={
                  <>
                    Use corrected age when plotting growth parameters for premature infants.
                    <Link 
                      href="https://www.cdc.gov/growthcharts/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ ml: 1 }}
                    >
                      Growth Charts
                    </Link>
                  </>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Neonatal Clinical Practice"
                secondary="Postmenstrual age is commonly used in NICUs for medication dosing, ventilator settings, and developmental care protocols."
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="privacy-content"
          id="privacy-header"
        >
          <Typography variant="h6">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon fontSize="small" />
              Privacy & Security
            </Box>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            This calculator operates entirely in your browser. No patient health information (PHI) 
            is transmitted to any server or stored remotely.
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Local Processing"
                secondary="All calculations are performed locally on your device."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="No Data Collection"
                secondary="We do not collect, store, or transmit any personal or medical information."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="HIPAA Considerations"
                secondary="While this tool processes no PHI, always follow your institution's guidelines for patient data handling."
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Disclaimer:</strong> This calculator is for educational and clinical reference purposes. 
          Always consult with qualified healthcare professionals for medical decisions and follow 
          your institution's specific protocols and guidelines.
        </Typography>
      </Box>
    </Paper>
  )
}
