import { Redirect } from 'expo-router';
import React from 'react';

// (shared)/index has no UI — push users to profile which is the main shared screen
export default function SharedIndex() {
  return <Redirect href={'/(shared)/profile' as never} />;
}