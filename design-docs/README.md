# Corrected Age Calculator - Design Documentation

This folder contains comprehensive design documentation for building a simple HTML application to calculate corrected age and postmenstrual age for infants.

## Documentation Overview

### 📋 [01-project-overview.md](./01-project-overview.md)
**Project Purpose and Requirements**
- Application purpose and target users
- Key features and medical background
- Success criteria and constraints
- Non-functional requirements

### 🧮 [02-calculation-specifications.md](./02-calculation-specifications.md)
**Mathematical Formulas and Logic**
- Detailed calculation specifications
- Input requirements and validation rules
- Core formulas for corrected age and postmenstrual age
- Edge cases and special scenarios
- Mathematical examples and implementation notes

### 🏗️ [03-technical-specification.md](./03-technical-specification.md)
**Implementation Architecture**
- Technology stack (HTML5, CSS3, Vanilla JavaScript)
- File structure and component architecture
- API design and data flow
- Performance and security considerations
- Browser compatibility and deployment strategy

### 🎨 [04-ui-ux-design.md](./04-ui-ux-design.md)
**User Interface and Experience Design**
- Design philosophy and principles
- User personas and user flows
- Wireframes and visual design system
- Component specifications and responsive design
- Accessibility features and interaction design

### 🧪 [05-testing-strategy.md](./05-testing-strategy.md)
**Comprehensive Testing Plan**
- Unit testing for calculation logic
- Integration testing for UI components
- User acceptance testing scenarios
- Accessibility and performance testing
- Cross-browser testing matrix

## Quick Start Guide

### For Developers
1. Start with **01-project-overview.md** to understand the application purpose
2. Review **02-calculation-specifications.md** for the mathematical requirements
3. Follow **03-technical-specification.md** for implementation guidance
4. Reference **04-ui-ux-design.md** for design specifications
5. Use **05-testing-strategy.md** to implement testing

### For Designers
1. Begin with **01-project-overview.md** for context and requirements
2. Focus on **04-ui-ux-design.md** for design specifications
3. Reference **02-calculation-specifications.md** for feature requirements
4. Review **05-testing-strategy.md** for usability testing scenarios

### For Project Managers
1. Start with **01-project-overview.md** for scope and success criteria
2. Review **03-technical-specification.md** for technical feasibility
3. Use **05-testing-strategy.md** for testing planning
4. Reference **04-ui-ux-design.md** for user experience requirements

## Medical Context

### What is Corrected Age?
Corrected age (also called adjusted age) is the age a preterm infant would be if they had been born at full term (40 weeks gestation). It's used to assess whether preterm infants are meeting developmental milestones appropriately.

### What is Postmenstrual Age?
Postmenstrual age (PMA) is the time elapsed since the onset of the mother's last menstrual period. It combines gestational age at birth with the time since birth.

### Why Are These Calculations Important?
- **Medical Assessment**: Healthcare providers use these calculations to evaluate development
- **Parent Education**: Helps parents understand their preterm baby's development timeline
- **Research**: Used in medical studies and clinical trials
- **Clinical Care**: Guides timing of medical interventions and assessments

## Implementation Roadmap

### Phase 1: Core Functionality (MVP)
- [ ] Basic HTML structure and styling
- [ ] Core calculation engine
- [ ] Input validation
- [ ] Results display
- [ ] Mobile-responsive design

### Phase 2: Enhanced UX
- [ ] Real-time calculations
- [ ] Help and educational content
- [ ] Improved error handling
- [ ] Accessibility improvements

### Phase 3: Advanced Features
- [ ] Offline functionality
- [ ] Print/export capabilities
- [ ] Multiple date format support
- [ ] Internationalization

### Phase 4: Testing and Deployment
- [ ] Comprehensive testing
- [ ] Cross-browser validation
- [ ] Performance optimization
- [ ] Production deployment

## Key Design Decisions

### Technology Choices
- **Vanilla JavaScript**: No frameworks for simplicity and performance
- **Static Files**: Easy deployment and offline capability
- **Mobile-First**: Primary use case is healthcare professionals on mobile devices

### Medical Accuracy
- **Validated Formulas**: All calculations based on established medical standards
- **Edge Case Handling**: Comprehensive coverage of preterm scenarios
- **Clear Explanations**: Medical terminology explained for all users

### User Experience
- **Single-Page Application**: Fast, focused interaction
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Accessibility First**: WCAG 2.1 AA compliance throughout

## File Dependencies

```
Design Documentation Dependencies:
01-project-overview.md
├── Informs all other documents
├── 02-calculation-specifications.md
├── 03-technical-specification.md
├── 04-ui-ux-design.md
└── 05-testing-strategy.md

Technical Dependencies:
02-calculation-specifications.md
├── → 03-technical-specification.md (implementation)
└── → 05-testing-strategy.md (test cases)

Design Dependencies:
01-project-overview.md
├── → 04-ui-ux-design.md (user requirements)
└── → 05-testing-strategy.md (acceptance criteria)
```

## Validation and Review

### Medical Review
- [ ] Calculation formulas verified by neonatologist
- [ ] Medical terminology reviewed for accuracy
- [ ] Educational content fact-checked

### Technical Review
- [ ] Architecture validated by senior developer
- [ ] Security considerations reviewed
- [ ] Performance targets validated

### Usability Review
- [ ] User flows tested with target personas
- [ ] Accessibility requirements verified
- [ ] Content clarity assessed

## Next Steps

1. **Begin Implementation**: Start with the technical specification
2. **Set Up Testing**: Implement testing framework early
3. **Create Prototypes**: Build UI mockups for validation
4. **Medical Validation**: Get formulas verified by medical professionals
5. **User Testing**: Test with real healthcare providers and parents

## Contact and Feedback

This documentation is designed to be comprehensive yet practical. If you find any gaps or have suggestions for improvement, please:

- Review the specific document that needs clarification
- Check if your question is answered in a related document
- Consider the intended audience for each document
- Propose specific improvements based on implementation experience

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Review Cycle**: Quarterly or before major implementation milestones
